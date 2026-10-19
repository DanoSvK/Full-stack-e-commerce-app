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
  if (!req.body.productId) req.body.productId = req.params.prodId;

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

export const createReview = catchAsync(async (req, res) => {
  const { rating, comment } = req.body;
  const productId = req.params.prodId;

  const review = await prisma.$transaction(async (tx) => {
    const created = await tx.review.create({
      data: { rating, comment, userId: req.user.id, productId },
    });
    await updateProductRatings(productId, tx);
    return created;
  });

  res.status(201).json({ status: "success", data: { review } });
});

export const updateReview = catchAsync(async (req, res, next) => {
  const review = await findReview(req);

  // Only the author can edit their review
  if (review.userId !== req.user.id) {
    return next(new AppError("You can only edit your own reviews", 403));
  }

  const { rating, comment } = req.body;

  const updated = await prisma.$transaction(async (tx) => {
    const result = await tx.review.update({
      where: { id: review.id },
      data: { rating, comment },
    });
    await updateProductRatings(review.productId, tx);
    return result;
  });

  res.status(200).json({ status: "success", data: { review: updated } });
});

export const deleteReview = catchAsync(async (req, res, next) => {
  const review = await findReview(req);

  await prisma.$transaction(async (tx) => {
    await tx.review.delete({ where: { id: review.id } });
    await updateProductRatings(review.productId, tx);
  });

  res.status(204).send();
});

export const getReview = getOne("review");
export const getAllReviews = getAll("review", getAllOptions);
