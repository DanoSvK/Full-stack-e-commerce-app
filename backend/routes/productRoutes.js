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

router.get("/", protect, getAllProducts);

router.get("/:prodId", getProduct);

router.post("/", createProduct);

router.patch("/:prodId", updateProduct);

export default router;
