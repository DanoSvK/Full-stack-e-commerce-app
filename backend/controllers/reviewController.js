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
  // Allow nested routes - if not nested, check the body, if nested check params
  req.body.user_id = req.user.id; // always from auth, never from body
  if (!req.body.product_id) req.body.product_id = parseInt(req.params.prodId);

  next();
};

export const checkExistingReview = catchAsync(async (req, res, next) => {
  const { product_id, user_id } = req.body; // destructure after setting

  const existingReview = await prisma.reviews.findUnique({
    where: {
      user_id_product_id: { user_id, product_id },
    },
  });

  if (existingReview) {
    return next(new AppError("You have already reviewed this product", 400));
  }

  next();
});

const getallOptions = {
  include: {
    users: { select: { id: true, username: true, email: true, role: true } },
    products: true,
  },
};

export const createReview = createOne("reviews");
export const deleteReview = deleteOne("reviews");
export const getReview = getOne("reviews");
export const getAllReviews = getAll("reviews", getallOptions);
export const updateReview = updateOne("reviews");
