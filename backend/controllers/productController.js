import prisma from "../lib/prisma.js";
import catchAsync from "../utils/catchAsync.js";
import {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} from "./handlerFactory.js";

export const createProduct = createOne("products");
export const updateProduct = updateOne("products");
export const deleteProduct = deleteOne("products");
export const getProduct = getOne("products", { product_categories: true });
export const getAllProducts = getAll("products", {
  include: { product_categories: true },
});
