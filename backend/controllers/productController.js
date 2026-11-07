import prisma from "../lib/prisma.js";
import { deleteOne, updateOne, createOne, getOne } from "./handlerFactory.js";
import APIFeatures from "../utils/apiFeatures.js";
import catchAsync from "../utils/catchAsync.js";

export const createProduct = createOne("product");

const allowedFields = ["title", "description", "price", "stock", "imageUrl"];
export const updateProduct = updateOne("product", allowedFields);
export const deleteProduct = deleteOne("product");
export const getProduct = getOne("product", {
  include: {
    subcategory: {
      include: { categories: { include: { category: true } } },
    },
  },
});

export const getAllProducts = catchAsync(async (req, res) => {
  const { category, subcategory, take, ...restQuery } = req.query;

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
  // Simple filter for Trending home page products
  const parsedTake = take !== undefined ? Number(take) : undefined;

  const isHighestRated = req.query.sort === "highest-rated";

  if (isHighestRated) {
    where.stock.gt = 0;

    const products = await prisma.product.findMany({
      where,
      ...(parsedTake !== undefined && { take: parsedTake }),
      include: {
        subcategory: {
          include: {
            categories: {
              include: { category: true },
            },
          },
        },
      },
    });

    const totalAverageRatingsCount = products.reduce(
      (a, b) => a + b.ratingsAverage * b.ratingsQuantity,
      0,
    );

    const totalProductAveragesQuantity = products.reduce(
      (a, b) => a + b.ratingsQuantity,
      0,
    );

    const c = totalAverageRatingsCount / totalProductAveragesQuantity;

    const prods = products.map((p) => {
      const v = p.ratingsQuantity;
      // Ratings quantity threshold (to be considered)
      const m = 10;
      const r = p.ratingsAverage;

      // Bayesian average formula
      const WR = (v / (v + m)) * r + (m / (v + m)) * c;
      p.bayesanRating = WR;

      return p;
    });

    prods.sort((a, b) => b.bayesanRating - a.bayesanRating);

    return res.json({
      result: prods.length,
      products: prods,
    });
  }

  if (req.query.sort === "refurbished-steals") {
    const products = await prisma.product.findMany({
      where: {
        stock: { gt: 0 },
        subcategory: {
          categories: { some: { category: { slug: "refurbished" } } },
        },
      },
      ...(parsedTake !== undefined && { take: parsedTake }),
      include: {
        subcategory: {
          include: { categories: { include: { category: true } } },
        },
      },
    });

    return res.json({
      result: products.length,
      products,
    });
  }

  if (req.query.sort === "trending-now") {
    where.stock = {};
    where.stock.gt = 0;
  }

  const [products, categories, total] = await Promise.all([
    prisma.product.findMany({
      where,
      ...rest,
      ...(parsedTake !== undefined && { take: parsedTake }),
      include: {
        subcategory: {
          include: { categories: { include: { category: true } } },
        },
        // wishlistedBy: true,
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
    where: { title: { contains: title, mode: "insensitive" } },
    select: {
      id: true,
      title: true,
      price: true,
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
