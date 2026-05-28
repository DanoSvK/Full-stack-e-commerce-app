import express from "express";
import { Router } from "express";
const router = Router();

import {
  signup,
  login,
  logout,
  protect,
  restrictTo,
  forgotPassword,
  resetPassword,
  updatePassword,
} from "../controllers/authController.js";

import {
  deleteUser,
  updateMe,
  deleteMe,
  getAllUsers,
} from "../controllers/userController.js";

router.post("/signup", signup);
router.post("/login", login);

router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);

router.get("/logout", logout);
router.delete("/deleteUser/:userId", protect, restrictTo("admin"), deleteUser);

router.patch("/updateMe", protect, updateMe);
router.delete("/deleteMe", protect, deleteMe);
router.patch("/updateMyPassword", protect, updatePassword);
router.get("/", getAllUsers);

export default router;
