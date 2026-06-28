import prisma from "../lib/prisma.js";
import { deleteOne, updateOne, createOne, getOne } from "./handlerFactory.js";
import APIFeatures from "../utils/apiFeatures.js";
import catchAsync from "../utils/catchAsync.js";

export const createProduct = createOne("product");
export const updateProduct = updateOne("product");
export const deleteProduct = deleteOne("product");
export const getProduct = getOne("product", {
  include: {
    subcategory: {
      include: { categories: { include: { category: true } } },
    },
  },
});

export const getAllProducts = catchAsync(async (req, res) => {
  const { category, subcategory, ...restQuery } = req.query;

  const features = new APIFeatures(restQuery)
    .filter()
    .sort()
    .fieldLimit()
    .paginate();

  const { where: baseWhere = {}, ...rest } = features.prismaQuery;

  const where = { ...baseWhere };

  if (subcategory) {
    where.subcategory = { slug: subcategory };
  } else if (category) {
    where.subcategory = {
      categories: {
        some: { category: { slug: category } },
      },
    };
  }

  const [products, categories, total] = await Promise.all([
    prisma.product.findMany({
      where,
      ...rest,
      include: {
        subcategory: {
          include: { categories: { include: { category: true } } },
        },
        wishlistedBy: true,
      },
    }),

    prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        subcategories: {
          select: {
            subcategory: { select: { id: true, name: true, slug: true } },
          },
        },
      },
    }),
    prisma.product.count({ where }),
  ]);

  res.json({
    result: products.length,
    products,
    facets: { categories },
    pagination: {
      total,
      page: Number(req.query.page) || 1,
      pageSize: Number(req.query.limit) || 10,
      totalPages: Math.ceil(total / (Number(req.query.limit) || 10)),
    },
  });
});

export const getProductCategories = catchAsync(async (req, res) => {
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      subcategories: {
        select: {
          subcategory: {
            select: { id: true, name: true, slug: true },
          },
        },
      },
    },
  });

  res.json({ categories });
});

export const getMinMaxPrice = catchAsync(async (req, res) => {
  const maxPrice = await prisma.product.aggregate({
    _max: { price: true },
  });

  const minPrice = await prisma.product.aggregate({
    _min: { price: true },
  });

  res.json({
    prices: { min: minPrice._min.price, max: maxPrice._max.price },
  });
});

export const searchProductSuggestion = catchAsync(async (req, res) => {
  const { title } = req.query;
  const products = await prisma.product.findMany({
    where: { title },
    select: {
      id: true,
      title: true,
      price: true,
      currency: true,
      imageUrl: true,
    },
    take: 5,
  });

  res.status(200).json({
    success: "true",
    data: {
      products,
    },
  });
});
