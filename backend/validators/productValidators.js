// backend/validators/productValidators.js
import * as z from "zod";

const productBaseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must have at least 3 characters")
    .max(60, "Title must have at most 60 characters"),

  description: z
    .string()
    .trim()
    .min(20, "Description must have at least 20 characters")
    .max(200, "Description must have at most 200 characters"),

  extendedDescription: z
    .string()
    .trim()
    .min(20, "Extended description must have at least 20 characters"),

  // Stored as an Int column, so whole numbers only (decide: euros or cents, and stick to it)
  price: z
    .number()
    .int("Price must be a whole number")
    .positive("Price must be a positive number"),

  stock: z
    .number()
    .int("Stock must be a whole number")
    .nonnegative("Stock cannot be negative"),

  imageUrl: z.url("Image URL must be a valid URL"),

  // e.g. { colors: ["Black"], sizes: ["S", "M"] }
  variants: z.record(z.string(), z.array(z.string())),

  subcategoryId: z.uuid("Product must have a valid subcategory ID"),
});

export const createProductSchema = productBaseSchema;

export const updateProductSchema = productBaseSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update",
  });
