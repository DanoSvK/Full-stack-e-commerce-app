import express from "express";
import { Router } from "express";
const router = Router();

import {
  getWishlist,
  addToWishlist,
} from "../controllers/wishlistController.js";
import { protect } from "../controllers/authController.js";

router.use(protect);

router.route("/").get(getWishlist).post(addToWishlist);

export default router;
