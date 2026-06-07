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
  optionalAuth,
} from "../controllers/authController.js";

import {
  createUser,
  deleteUser,
  updateMe,
  deleteMe,
  updateUser,
  getAllUsers,
  getUser,
  getMe,
} from "../controllers/userController.js";

import validate from "../utils/validator.js";
import {
  createUserSchema,
  updateUserSchema,
  updateUserPasswordSchema,
} from "../validators/userValidators.js";

router.post("/signup", validate(createUserSchema), signup);
router.post("/login", login);
router.get("/logout", logout);
router.post("/forgotPassword", forgotPassword);
router.patch(
  "/resetPassword/:token",
  validate(updateUserPasswordSchema),
  resetPassword,
);

router.get("/me", optionalAuth, getMe);

// Protect all routes after this middleware
router.use(protect);

router.patch(
  "/updateMyPassword",
  validate(updateUserPasswordSchema),
  updatePassword,
);

router.patch("/updateMe", validate(updateUserSchema), updateMe);
router.delete("/deleteMe", deleteMe);

// Restrict all routes after this middleware to admin only
router.use(restrictTo("admin"));

router.route("/").get(getAllUsers).post(validate(createUserSchema), createUser);
router
  .route("/:id")
  .get(getUser)
  .patch(validate(updateUserSchema), updateUser)
  .delete(deleteUser);

export default router;
