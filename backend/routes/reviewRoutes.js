import {
  createReview,
  getAllReviews,
} from "../controllers/reviewController.js";
import { protect, restrictTo } from "../controllers/authController.js";

import express from "express";
import { Router } from "express";
const router = Router({ mergeParams: true }); // to access params from parent router

router
  .route("/")
  .get(getAllReviews)
  .post(protect, restrictTo("USER"), createReview);

export default router;
