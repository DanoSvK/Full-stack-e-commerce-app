import { promisify } from "util";
import catchAsync from "../utils/catchAsync.js";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import AppError from "../utils/appError.js";
import sendEmail from "../utils/email.js";

const signToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  // Remove password from output
  delete user.password;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

export const signup = catchAsync(async (req, res, next) => {
  const { username, email, password, confirmPassword, passwordChangedAt } =
    req.body;

  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      passwordChangedAt,
    },
  });

  createSendToken(newUser, 201, res);
});

export const login = catchAsync(async (req, res, next) => {
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password;

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, password: true },
  });

  // Always run bcrypt to prevent timing attacks
  const DUMMY_HASH = await bcrypt.hash("dummy-password", 12);
  const isValid = await bcrypt.compare(
    password,
    user ? user.password : DUMMY_HASH,
  );

  if (!user || !isValid) {
    return next(new AppError("Incorrect email or password", 401));
  }

  const safeUser = {
    id: user.id,
    email: user.email,
  };

  createSendToken(safeUser, 200, res);
});

export const logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

export const protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401),
    );
  }

  // 2) Verification token - decoded contains the payload we signed using jwt.sign() method (user id, iat, exp)
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //  3) Check if user still exists
  const currentUser = await prisma.user.findUnique({
    where: { id: decoded.id },
    select: {
      id: true,
      email: true,
      role: true,
      passwordChangedAt: true, // ✅ must be selected
    },
  });

  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401,
      ),
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.passwordChangedAt) {
    const changedTimestamp = Math.floor(
      currentUser.passwordChangedAt.getTime() / 1000,
    );

    if (decoded.iat < changedTimestamp) {
      return next(
        new AppError(
          "User recently changed password! Please log in again.",
          401,
        ),
      );
    }
  }

  req.user = currentUser; // Grant access to protected route
  next();
});

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles is an array of roles that are allowed to access the route
    if (!roles.includes(req.user.role.toLowerCase())) {
      return next(
        new AppError("You do not have permission to perform this action", 403),
      );
    }

    next();
  };
};

export const forgotPassword = catchAsync(async (req, res, next) => {
  const genericResponse = () => {
    res.status(200).json({
      status: "success",
      message:
        "If you have entered the correct email address, we have sent you an email with instructions to reset your password.",
    });
  };

  // 1) Get user based on POSTed email
  const user = await prisma.user.findUnique({
    where: { email: req.body.email },
  });

  if (!user) return genericResponse();

  // 2) Generate the random reset token
  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenHash = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordResetToken: resetTokenHash,
      passwordResetExpires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    },
  });

  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get("host")}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Forgot your password? Submit a request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 minutes)",
      message,
    });

    return genericResponse();
  } catch (err) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: undefined,
        passwordResetExpires: undefined,
      },
    });

    return next(
      new AppError("There was an error sending the email. Try again later!"),
      500,
    );
  }
});

export const resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await prisma.user.findFirst({
    where: {
      passwordResetToken: hashedToken,
      passwordResetExpires: { gt: new Date() },
    },
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }

  if (!req.body.password) {
    return next(new AppError("Password is required", 400));
  }

  // 3) Update changedPasswordAt property for the user
  await prisma.users.update({
    where: { id: user.id },
    data: {
      password: await bcrypt.hash(req.body.password, 12),
      passwordResetToken: undefined,
      passwordResetExpires: undefined,
      passwordChangedAt: new Date(Date.now() - 1000),
    },
  });

  // 4) Log the user in, send JWT
  // 4) Log user in, send JWT
  createSendToken(user, 200, res);
});

export const updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from model
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, password: true },
  });

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  // 2) Check if POSTed current password is correct
  const isValid = await bcrypt.compare(req.body.currentPassword, user.password);
  if (!isValid) {
    return next(new AppError("Your current password is incorrect.", 401));
  }

  // 3) If so, update password
  await prisma.users.update({
    where: { id: user.id },
    data: {
      password: await bcrypt.hash(req.body.newPassword, 12),
      passwordChangedAt: new Date(Date.now() - 1000),
    },
  });

  // 4) Log user in, send JWT
  createSendToken(user, 200, res);
});
