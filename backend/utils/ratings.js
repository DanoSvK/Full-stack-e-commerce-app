import prisma from "../lib/prisma.js";

export const updateProductRatings = async (productId, db = prisma) => {
  const stats = await db.review.aggregate({
    where: { productId },
    _avg: { rating: true },
    _count: { rating: true },
  });

  await db.product.update({
    where: { id: productId },
    data: {
      ratingsAverage: stats._avg.rating
        ? Math.round(stats._avg.rating * 10) / 10
        : 0,
      ratingsQuantity: stats._count.rating,
    },
  });
};
