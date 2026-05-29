import { prisma } from "../lib/prisma.js";
import catchAsync from "../utils/catchAsync.js";

export const getAllProducts = catchAsync(async (req, res) => {
  const products = await prisma.products.findMany({
    include: { product_categories: true },
  });

  res.status(200).json({
    status: "success",
    results: products.length,
    data: {
      products,
    },
  });
});

export const getProduct = catchAsync(async (req, res) => {
  const { prodId } = req.params;

  const product = await prisma.products.findUnique({
    where: { id: parseInt(prodId) },
    include: {
      product_categories: true,
    },
  });

  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
});

export const createProduct = catchAsync(async (req, res) => {
  const { title, description, price, quantity, image_url } = req.body;

  const product = await prisma.products.create({
    data: {
      title,
      description,
      price,
      quantity,
      image_url,
    },
  });

  res.status(201).json({
    status: "success",
    data: {
      product,
    },
  });
});

export const updateProduct = catchAsync(async (req, res) => {
  const { prodId } = req.params;
  const { title, description, price, quantity, image_url } = req.body;
  const product = await prisma.products.update({
    where: { id: parseInt(prodId) },
    data: {
      title,
      description,
      price,
      quantity,
      image_url,
    },
  });

  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
});

export const deleteProduct = catchAsync(async (req, res) => {});
