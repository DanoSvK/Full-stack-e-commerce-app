import express from "express";
import { Router } from "express";
const router = Router();

import {
  getAllProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  getProductCategories,
  getMinMaxPrice,
  searchProductSuggestion,
} from "../controllers/productController.js";
import { protect } from "../controllers/authController.js";
import reviewRouter from "./reviewRoutes.js";
import { restrictTo } from "../controllers/authController.js";
import validate from "../utils/validator.js";
import {
  createProductSchema,
  updateProductSchema,
} from "../validators/productValidators.js";

router
  .route("/")
  .get(getAllProducts)
  .post(
    protect,
    restrictTo("ADMIN"),
    validate(createProductSchema),
    createProduct,
  );

router.get("/categories", getProductCategories);
router.get("/prices", getMinMaxPrice);
router.get("/suggestions", searchProductSuggestion);

router
  .route("/:id")
  .get(getProduct)
  .patch(
    protect,
    restrictTo("ADMIN"),
    validate(updateProductSchema),
    updateProduct,
  )
  .delete(protect, restrictTo("ADMIN"), deleteProduct);

// /api/v1/products/:prodId/reviews
router.use("/:prodId/reviews", reviewRouter);

export default router;
