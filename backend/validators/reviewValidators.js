// backend/validators/reviewValidators.js
import * as z from "zod";

const ratingSchema = z
  .number()
  .int("Rating must be a whole number")
  .min(1, "Rating must be at least 1")
  .max(5, "Rating cannot be higher than 5");

const commentSchema = z
  .string()
  .trim()
  .max(1000, "Comment cannot be longer than 1000 characters");

// userId is never accepted from the client, it always comes from the auth token.
// productId is optional here because /products/:prodId/reviews supplies it via the URL.
export const createReviewSchema = z.object({
  rating: ratingSchema,
  comment: commentSchema.optional(),
  productId: z.uuid().optional(),
});

export const updateReviewSchema = z
  .object({
    rating: ratingSchema,
    comment: commentSchema,
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide a rating or a comment to update",
  });
