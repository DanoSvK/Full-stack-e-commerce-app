import prisma from "../lib/prisma.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

export const addToWishlist = catchAsync(async (req, res) => {
  const productId = req.params.productId;
  const wishlist = await prisma.wishlist.create({
    data: { userId: req.user.id, productId },
  });

  res.status(201).json({
    status: "success",
    data: { wishlist },
  });
});

export const syncWishlist = catchAsync(async (req, res) => {
  const productIds = req.body;

  const wishlist = await prisma.wishlist.createMany({
    data: productIds.map((productId) => ({
      userId: req.user.id,
      productId,
    })),
    skipDuplicates: true,
  });

  res.status(201).json({
    status: "success",
    data: { wishlist },
  });
});

export const getWishlist = catchAsync(async (req, res) => {
  const wishlist = await prisma.wishlist.findMany({
    where: { userId: req.user.id },
    include: {
      product: {
        include: {
          subcategory: {
            include: {
              categories: {
                include: {
                  category: true,
                },
              },
            },
          },
        },
      },
    },
  });

  res.status(200).json({
    status: "success",
    result: wishlist.length,
    data: { wishlist },
  });
});

export const deleteOneFromWishlist = catchAsync(async (req, res) => {
  const productId = req.params.productId;
  await prisma.wishlist.delete({
    where: {
      userId_productId: {
        userId: req.user.id,
        productId,
      },
    },
  });

  res.status(204).json({ status: "success", data: null });
});

export const deleteAllWishlist = catchAsync(async (req, res) => {
  const wishlist = await prisma.wishlist.deleteMany({
    where: { userId: req.user.id },
  });

  if (!wishlist) {
    return next(new AppError("Error"));
  }

  return res.status(204).json({
    status: "success",
    data: null,
  });
});
