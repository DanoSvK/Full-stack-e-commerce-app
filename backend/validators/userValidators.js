import * as z from "zod";
import { Role } from "../generated/prisma/client.js";

const passwordSchema = z
  .string()
  .min(8, "Password must have at least 8 characters")
  .max(64, "Password must have less than 64 characters");

const userBaseSchema = z.object({
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
});

export const createUserSchema = userBaseSchema
  .extend({
    password: passwordSchema,

    passwordConfirm: passwordSchema,

    role: z.nativeEnum(Role).default(Role.USER),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords do not match",
    path: ["passwordConfirm"],
  });

export const updateUserPasswordSchema = z
  .object({
    password: passwordSchema,

    passwordConfirm: passwordSchema,
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords do not match",
    path: ["passwordConfirm"],
  });

export const updateUserSchema = userBaseSchema.partial();
