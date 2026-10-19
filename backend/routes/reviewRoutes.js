// backend/routes/reviewRoutes.js
import { Router } from "express";
import {
  createReview,
  getAllReviews,
  getReview,
  deleteReview,
  updateReview,
} from "../controllers/reviewController.js";
import { protect } from "../controllers/authController.js";
import validate from "../utils/validator.js";
import {
  createReviewSchema,
  updateReviewSchema,
} from "../validators/reviewValidators.js";

const router = Router({ mergeParams: true }); // access :prodId from parent router

// Public
router.get("/", getAllReviews);
router.get("/:id", getReview);

// Everything below requires a logged-in user.
// Ownership/role checks (author vs admin/moderator) happen in the controller.
router.use(protect);

router.post("/", validate(createReviewSchema), createReview);

router
  .route("/:id")
  .patch(validate(updateReviewSchema), updateReview)
  .delete(deleteReview);

export default router;
