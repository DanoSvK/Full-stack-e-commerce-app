import prisma from "../lib/prisma.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import {
  createOne,
  deleteOne,
  updateOne,
  getOne,
  getAll,
} from "./handlerFactory.js";

const filterObj = (obj, ...allowedFields) => {
  Object.keys(obj).forEach((el) => {
    if (!allowedFields.includes(el)) delete obj[el];
  });

  return obj;
};

export const getMe = catchAsync(async (req, res, next) => {
  if (!req.user) {
    return res.status(200).json({ status: "success", data: { user: null } });
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      email: true,
    },
  });

  res.status(200).json({
    status: "success",
    data: { user: req.user ?? null },
  });
});

export const updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
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
  const updatedUser = await prisma.user.update({
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
  await prisma.user.update({
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

const getAllOptions = {
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
};

export const createUser = createOne("user");
export const deleteUser = deleteOne("user");
export const updateUser = updateOne("user");
export const getUser = getOne("user");
export const getAllUsers = getAll("user", getAllOptions);
