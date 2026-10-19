import * as client from "openid-client";
import crypto from "node:crypto";

import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import prisma from "../lib/prisma.js";
import { signToken } from "./authController.js";

let configPromise;

const getClient = async () => {
  if (!configPromise) {
    configPromise = client
      .discovery(
        new URL("https://accounts.google.com"),
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
      )
      .catch((err) => {
        configPromise = undefined;
        throw err;
      });
  }

  return configPromise;
};

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
};

const clearOAuthCookies = (res) => {
  res.clearCookie("oauth_state", cookieOptions);
  res.clearCookie("oauth_nonce", cookieOptions);
  res.clearCookie("oauth_verifier", cookieOptions);
};

const generateUniqueUsername = async (name) => {
  const base =
    (name || "user")
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 20) || "user";

  // Random suffix makes collisions unlikely.
  for (let attempt = 0; attempt < 5; attempt++) {
    const suffix = crypto.randomBytes(4).toString("hex");
    const username = `${base.slice(0, 20)}_${suffix}`;

    const existing = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });

    if (!existing) return username;
  }

  throw new AppError("Could not generate a unique username", 500);
};

export const oauthLogin = catchAsync(async (req, res) => {
  const config = await getClient();

  const codeVerifier = client.randomPKCECodeVerifier();
  const codeChallenge = await client.calculatePKCECodeChallenge(codeVerifier);

  const state = client.randomState();
  const nonce = client.randomNonce();

  const options = {
    ...cookieOptions,
    maxAge: 5 * 60 * 1000,
  };

  res.cookie("oauth_state", state, options);
  res.cookie("oauth_nonce", nonce, options);
  res.cookie("oauth_verifier", codeVerifier, options);

  const parameters = {
    redirect_uri: process.env.REDIRECT_URI,
    scope: "openid email profile",
    state,
    nonce,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  };

  const authUrl = client.buildAuthorizationUrl(config, parameters);

  res.redirect(authUrl.href);
});

export const oauthCallback = catchAsync(async (req, res) => {
  const codeVerifier = req.cookies?.oauth_verifier;
  const state = req.cookies?.oauth_state;
  const nonce = req.cookies?.oauth_nonce;

  clearOAuthCookies(res);

  if (!codeVerifier || !state || !nonce) {
    throw new AppError("OAuth session expired. Please try again.", 400);
  }

  const config = await getClient();

  const callbackUrl = new URL(process.env.REDIRECT_URI);
  callbackUrl.search = new URLSearchParams(
    Object.entries(req.query).map(([key, value]) => [key, String(value)]),
  ).toString();

  const tokens = await client.authorizationCodeGrant(config, callbackUrl, {
    pkceCodeVerifier: codeVerifier,
    expectedState: state,
    expectedNonce: nonce,
  });

  const claims = tokens.claims();

  // Verify the Google identity before using its email.
  if (!claims?.sub || !claims.email || claims.email_verified !== true) {
    throw new AppError("Google email is not verified", 401);
  }

  const googleId = claims.sub;
  const email = claims.email.trim().toLowerCase();

  // 1. Find an existing account by Google's stable subject ID.
  let user = await prisma.user.findUnique({
    where: { googleId },
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
    },
  });

  // 2. If this is the first Google login, check the email.
  if (!user) {
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        googleId: true,
      },
    });

    if (existingUser) {
      // Never overwrite another Google identity.
      if (existingUser.googleId && existingUser.googleId !== googleId) {
        throw new AppError(
          "This account is linked to another Google account",
          409,
        );
      }

      // Link Google to the existing user.
      // For higher security, require existing-account authentication
      // before linking an account that was previously password-based.
      user = await prisma.user.update({
        where: { id: existingUser.id },
        data: { googleId },
        select: {
          id: true,
          email: true,
          username: true,
          role: true,
        },
      });
    } else {
      // 3. Create a new user.
      const username = await generateUniqueUsername(claims.name);

      user = await prisma.user.create({
        data: {
          email,
          username,
          googleId,
          role: "USER",
        },
        select: {
          id: true,
          email: true,
          username: true,
          role: true,
        },
      });
    }
  }

  // 4. Sign JWT and send it in an HTTP-only cookie.
  const token = signToken(user.id);

  const expiresInDays = Number(process.env.JWT_COOKIE_EXPIRES_IN);

  if (!Number.isFinite(expiresInDays) || expiresInDays <= 0) {
    throw new AppError("Invalid JWT cookie expiration configuration", 500);
  }

  res.cookie("jwt", token, {
    ...cookieOptions,
    expires: new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000),
  });

  // 5. Redirect to the React frontend.
  res.redirect(process.env.FRONTEND_URL);
});
