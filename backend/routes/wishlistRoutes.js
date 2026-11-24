import express from "express";
import { Router } from "express";
const router = Router();

import {
  getWishlist,
  addToWishlist,
  deleteOneFromWishlist,
  deleteAllWishlist,
  syncWishlist,
} from "../controllers/wishlistController.js";
import { protect } from "../controllers/authController.js";

router.use(protect);

router.route("/").get(getWishlist).post(syncWishlist).delete(deleteAllWishlist);

router.route("/:productId").post(addToWishlist).delete(deleteOneFromWishlist);

export default router;
