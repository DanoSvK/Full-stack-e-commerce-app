import { prisma } from "../lib/prisma.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

const filterObj = (obj, ...allowedFields) => {
  Object.keys(obj).forEach((el) => {
    if (!allowedFields.includes(el)) delete obj[el];
  });

  return obj;
};

export const deleteUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const user = await prisma.users.delete({
    where: { id: parseInt(userId) },
  });
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

export const updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword.",
        400,
      ),
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, "name", "email");

  // 3) Update user record
  const updatedUser = await prisma.users.update({
    where: { id: req.user.id },
    data: filteredBody,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

export const deleteMe = catchAsync(async (req, res, next) => {
  await prisma.users.update({
    where: {
      id: req.user.id,
    },
    data: {
      active: false,
    },
  });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

export const getUser = catchAsync(async (req, res, next) => {});

export const createUser = catchAsync(async (req, res, next) => {});

export const updateUser = catchAsync(async (req, res, next) => {});

export const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await prisma.users.findMany({
    where: {
      active: {
        not: false,
      },
    },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
    },
  });

  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});
