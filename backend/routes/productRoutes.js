import express from "express";
import { Router } from "express";
const router = Router();

import {
  getAllProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { protect } from "../controllers/authController.js";
import reviewRouter from "./reviewRoutes.js";
import { restrictTo } from "../controllers/authController.js";

router
  .route("/")
  .get(protect, getAllProducts)
  .post(protect, restrictTo("admin"), createProduct);

router
  .route("/:prodId")
  .get(getProduct)
  .patch(protect, restrictTo("admin"), updateProduct);

// /api/v1/products/:prodId/reviews
router.use("/:prodId/reviews", reviewRouter);

export default router;
