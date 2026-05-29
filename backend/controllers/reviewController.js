import { prisma } from "../lib/prisma.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

export const getAllReviews = catchAsync(async (req, res, next) => {
  let where = {};
  if (req.params.prodId) where = { product_id: parseInt(req.params.prodId) };

  const reviews = await prisma.reviews.findMany({
    where,
    include: {
      users: { select: { id: true, username: true, email: true, role: true } },
      products: true,
    },
  });

  res.status(200).json({
    status: "success",
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

export const createReview = catchAsync(async (req, res, next) => {
  // Allow nested routes - if not nested, check the body, if nested check params
  req.body.user_id = req.user.id; // always from auth, never from body
  if (!req.body.product_id) req.body.product_id = parseInt(req.params.prodId);

  const { product_id, user_id } = req.body; // destructure after setting

  const existingReview = await prisma.reviews.findUnique({
    where: {
      user_id_product_id: { user_id, product_id },
    },
  });

  if (existingReview) {
    return next(new AppError("You have already reviewed this product", 400));
  }

  const newReview = await prisma.reviews.create({
    data: {
      rating: req.body.rating,
      comment: req.body.comment,
      status: "pending",
      user_id,
      product_id,
    },
  });

  res.status(201).json({
    status: "success",
    data: { review: newReview },
  });
});
