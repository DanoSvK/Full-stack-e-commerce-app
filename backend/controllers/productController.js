import {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} from "./handlerFactory.js";
import APIFeatures from "../utils/apiFeatures.js";

export const createProduct = createOne("product");
export const updateProduct = updateOne("product");
export const deleteProduct = deleteOne("product");
export const getProduct = getOne("product", { categories: true });
export const getAllProducts = getAll("product", {
  include: { categories: true },
});
