import * as z from "zod";

const reviewBaseSchema = z.object({
  rating: z
    .number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot be higher than 5")
    .transform((val) => Math.round(val * 10) / 10),

  comment: z
    .string()
    .regex(
      /^[a-zA-Z0-9\s]+$/,
      "Comment can only contain letters, numbers, and spaces",
    )
    .optional(),

  user_id: z.number({
    required_error: "Review must belong to a user",
  }),

  product_id: z.number({
    required_error: "Review must belong to a product",
  }),
});

export const createReviewSchema = reviewBaseSchema;
export const updateReviewSchema = reviewBaseSchema.partial();
