import * as z from "zod";

const productBaseSchema = z.object({
  title: z
    .string()
    .min(3, "A tour must have more or equal than 10 characters")
    .max(40, "A tour must have less or equal than 40 characters")
    .regex(/^[A-Za-z\s]+$/, "Tour name must only contain letters and spaces"),

  description: z
    .string()
    .min(20, "A tour must have more or equal than 20 characters")
    .max(200, "A tour must have less or equal than 200 characters"),

  price: z.number().positive("Price must be a positive number"),

  quantity: z
    .number()
    .int("Quantity must be an integer")
    .nonnegative("Quantity cannot be negative"),

  image_url: z.string().url("Image URL must be a valid URL"),
});

export const createProductSchema = productBaseSchema;

export const updateProductSchema = productBaseSchema.partial();
