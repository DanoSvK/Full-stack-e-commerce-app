import * as client from "openid-client";
import catchAsync from "../utils/catchAsync.js";
import prisma from "../lib/prisma.js";
import { createSendToken, signToken } from "./authController.js";

let oauthClient;
let config;

const getClient = async () => {
  if (config) return config;
  config = await client.discovery(
    new URL("https://accounts.google.com"),
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
  );
  return config;
};

export const oauthLogin = catchAsync(async (req, res) => {
  const config = await getClient();

  const codeVerifier = client.randomPKCECodeVerifier();
  const codeChallenge = await client.calculatePKCECodeChallenge(codeVerifier);
  const state = client.randomState();
  const nonce = client.randomNonce();

  const cookieOptions = { httpOnly: true, maxAge: 5 * 60 * 1000 };
  res.cookie("oauth_state", state, cookieOptions);
  res.cookie("oauth_nonce", nonce, cookieOptions);
  res.cookie("oauth_verifier", codeVerifier, cookieOptions);

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
  const config = await getClient();

  const codeVerifier = req.cookies.oauth_verifier;
  const state = req.cookies.oauth_state;
  const nonce = req.cookies.oauth_nonce;

  res.clearCookie("oauth_state");
  res.clearCookie("oauth_nonce");
  res.clearCookie("oauth_verifier");

  const tokens = await client.authorizationCodeGrant(
    config,
    new URL(`${process.env.REDIRECT_URI}?${new URLSearchParams(req.query)}`),
    {
      pkceCodeVerifier: codeVerifier,
      expectedState: state,
      expectedNonce: nonce,
    },
  );

  const claims = tokens.claims();

  let user = await prisma.user.findUnique({ where: { email: claims.email } });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: claims.email,
        username: claims.name,
        password: null,
        role: "USER",
      },
      select: { id: true, email: true, username: true, role: true },
    });
  }

  // Replace createSendToken with this:
  const token = signToken(user.id);

  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  });

  res.redirect("http://localhost:5173"); // ← sends user back to your React app
});
