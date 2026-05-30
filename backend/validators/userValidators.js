import * as z from "zod";

const userBaseSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must have more than 2 characters")
      .max(20, "Username must have less than 20 characters")
      .trim()
      .regex(/^[A-Za-z\s]+$/, "Username must only contain letters and spaces"),

    email: z
      .string()
      .email("Please, enter a proper email format")
      .lowercase()
      .trim(),
  })
  .partial();

export const createUserSchema = userBaseSchema
  .extend({
    password: z.string().min(8).max(64),

    passwordConfirm: z.string().min(8).max(64),

    roles: z.enum(["user", "moderator", "admin"]),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords do not match",
    path: ["passwordConfirm"],
  });

export const updateUserPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must have at least 8 characters")
      .max(64, "Password must have less than 64 characters"),

    passwordConfirm: z
      .string()
      .min(8, "Password confirmation must have at least 8 characters")
      .max(64, "Password confirmation must have less than 64 characters"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords do not match",
    path: ["passwordConfirm"],
  });

export const updateUserSchema = userBaseSchema.partial();
