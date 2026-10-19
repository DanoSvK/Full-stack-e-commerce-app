import prisma from "../lib/prisma.js";

export const updateProductRatings = async (productId) => {
  const stats = await prisma.review.aggregate({
    where: { productId },
    _avg: { rating: true },
    _count: { rating: true },
  });

  await prisma.product.update({
    where: { id: productId },
    data: {
      ratingsAverage: stats._avg.rating
        ? Math.round(stats._avg.rating * 10) / 10
        : 0,
      ratingsQuantity: stats._count.rating,
    },
  });
};
