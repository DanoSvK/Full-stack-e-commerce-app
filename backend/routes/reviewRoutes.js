import {
  createReview,
  getAllReviews,
  getReview,
  deleteReview,
  updateReview,
  setProductUserIds,
  checkExistingReview,
} from "../controllers/reviewController.js";
import { protect, restrictTo } from "../controllers/authController.js";

import validate from "../utils/validator.js";
import {
  createReviewSchema,
  updateReviewSchema,
} from "../validators/reviewValidators.js";

import express from "express";
import { Router } from "express";
const router = Router({ mergeParams: true }); // to access params from parent router

router.get("/", getAllReviews);

//protect all routes after this middleware
router.use(protect);

router.post(
  "/",
  protect,
  restrictTo("user"),
  setProductUserIds,
  checkExistingReview,
  createReview,
);

router
  .route("/:id")
  .get(getReview)
  .patch(protect, restrictTo("user, moderator"), updateReview)
  .delete(protect, restrictTo("user", "moderator"), deleteReview);

export default router;
