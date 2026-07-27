import prisma from "../lib/prisma.js";
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

export const deleteFromWishlist = catchAsync(async (req, res) => {
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
