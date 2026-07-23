import express from "express";
import { Router } from "express";
const router = Router();

import {
  getWishlist,
  addToWishlist,
  deleteFromWishlist,
} from "../controllers/wishlistController.js";
import { protect } from "../controllers/authController.js";

router.use(protect);

router.route("/").get(getWishlist);

router.route("/:productId").post(addToWishlist).delete(deleteFromWishlist);

export default router;
