// backend/controllers/reviewController.js
import prisma from "../lib/prisma.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import APIFeatures from "../utils/apiFeatures.js";
import { getOne } from "./handlerFactory.js";
import { updateProductRatings } from "../utils/ratings.js";

const MODERATOR_ROLES = ["ADMIN", "MODERATOR"];

// Loads a review and makes sure it belongs to the product in the URL (if any)
const findReview = async (req) => {
  const review = await prisma.review.findUnique({
    where: { id: req.params.id },
  });

  if (!review) throw new AppError("No review found with that ID", 404);

  if (req.params.prodId && review.productId !== req.params.prodId) {
    throw new AppError("No review found with that ID", 404);
  }

  return review;
};

export const getReview = getOne("review");

export const getAllReviews = catchAsync(async (req, res) => {
  const features = new APIFeatures(req.query, {
    filters: { rating: "number" },
    sortable: ["createdAt", "rating"],
  })
    .filter()
    .sort()
    .paginate();

  const { where, ...rest } = features.prismaQuery;

  // Nested route: /products/:prodId/reviews
  if (req.params.prodId) where.productId = req.params.prodId;

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where,
      ...rest,
      include: { user: { select: { id: true, username: true } } },
    }),
    prisma.review.count({ where }),
  ]);

  res.status(200).json({
    status: "success",
    results: reviews.length,
    pagination: features.paginationInfo(total),
    data: { reviews },
  });
});

export const createReview = catchAsync(async (req, res, next) => {
  const { rating, comment } = req.body;
  const productId = req.params.prodId ?? req.body.productId;

  if (!productId) {
    return next(new AppError("A review must belong to a product", 400));
  }

  let review;
  try {
    review = await prisma.$transaction(async (tx) => {
      const created = await tx.review.create({
        data: { rating, comment, productId, userId: req.user.id },
      });
      await updateProductRatings(productId, tx);
      return created;
    });
  } catch (err) {
    // @@unique([userId, productId]) -> one review per user per product
    if (err.code === "P2002") {
      return next(new AppError("You have already reviewed this product", 400));
    }
    // Foreign key failed -> product doesn't exist
    if (err.code === "P2003") {
      return next(new AppError("Product not found", 404));
    }
    throw err;
  }

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

  // Author can delete their own review, admins/moderators can delete any
  const isOwner = review.userId === req.user.id;
  const isModerator = MODERATOR_ROLES.includes(req.user.role);

  if (!isOwner && !isModerator) {
    return next(new AppError("You can only delete your own reviews", 403));
  }

  await prisma.$transaction(async (tx) => {
    await tx.review.delete({ where: { id: review.id } });
    await updateProductRatings(review.productId, tx);
  });

  res.status(204).send();
});
