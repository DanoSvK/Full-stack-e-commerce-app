import prisma from "../lib/prisma.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import {
  deleteOne,
  createOne,
  getOne,
  getAll,
  updateOne,
} from "./handlerFactory.js";

export const setProductUserIds = (req, res, next) => {
  // Allow nested routes
  // If not nested, check the body, if nested check params
  req.body.userId = req.user.id; // always from auth, never from body
  if (!req.body.productId) req.body.productId = parseInt(req.params.prodId);

  next();
};

export const checkExistingReview = catchAsync(async (req, res, next) => {
  const { productId, userId } = req.body;

  const existingReview = await prisma.review.findUnique({
    where: {
      userId_productId: { userId, productId },
    },
  });

  if (existingReview) {
    return next(new AppError("You have already reviewed this product", 400));
  }

  next();
});

const getAllOptions = {
  include: {
    user: { select: { id: true, username: true, email: true, role: true } },
    product: true,
  },
};

export const createReview = createOne("review");
export const deleteReview = deleteOne("review");
export const getReview = getOne("review");
export const getAllReviews = getAll("review", getAllOptions);
export const updateReview = updateOne("review");
