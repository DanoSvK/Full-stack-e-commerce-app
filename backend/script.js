import { randomUUID } from "crypto";
import prisma from "./lib/prisma.js";

async function main() {
  // 1. Seed categories
  await prisma.category.createMany({
    data: [
      {
        id: randomUUID(),
        name: "Electronics",
        slug: "electronics",
      },
      {
        id: randomUUID(),
        name: "Apparel",
        slug: "apparel",
      },
      {
        id: randomUUID(),
        name: "Refurbished",
        slug: "refurbished",
      },
      {
        id: randomUUID(),
        name: "Sportswear",
        slug: "sportswear",
      },
    ],
    skipDuplicates: true,
  });

  const categories = await prisma.category.findMany();
  const categoryMap = Object.fromEntries(categories.map((c) => [c.name, c.id]));

  // 2. Seed subcategories
  await prisma.subcategory.createMany({
    data: [
      {
        id: randomUUID(),
        name: "Smartphones",
        slug: "smartphones",
      },
      {
        id: randomUUID(),
        name: "Laptops",
        slug: "laptops",
      },
      {
        id: randomUUID(),
        name: "T-Shirts",
        slug: "t-shirts",
      },
      {
        id: randomUUID(),
        name: "Hoodies",
        slug: "hoodies",
      },
    ],
    skipDuplicates: true,
  });

  const subcategories = await prisma.subcategory.findMany();

  const subcategoryMap = Object.fromEntries(
    subcategories.map((s) => [s.name, s.id]),
  );

  // 3. Link subcategories to categories
  await prisma.categorySubcategory.createMany({
    data: [
      {
        categoryId: categoryMap["Electronics"],
        subcategoryId: subcategoryMap["Smartphones"],
      },
      {
        categoryId: categoryMap["Refurbished"],
        subcategoryId: subcategoryMap["Smartphones"],
      },
      {
        categoryId: categoryMap["Electronics"],
        subcategoryId: subcategoryMap["Laptops"],
      },
      {
        categoryId: categoryMap["Refurbished"],
        subcategoryId: subcategoryMap["Laptops"],
      },
      {
        categoryId: categoryMap["Apparel"],
        subcategoryId: subcategoryMap["T-Shirts"],
      },
      {
        categoryId: categoryMap["Sportswear"],
        subcategoryId: subcategoryMap["T-Shirts"],
      },
      {
        categoryId: categoryMap["Apparel"],
        subcategoryId: subcategoryMap["Hoodies"],
      },
      {
        categoryId: categoryMap["Sportswear"],
        subcategoryId: subcategoryMap["Hoodies"],
      },
    ],
    skipDuplicates: true,
  });

  // 4. Create products
  for (let i = 0; i < 48; i++) {
    const category = i % 2 === 0 ? "Electronics" : "Apparel";

    const subcategory =
      category === "Electronics"
        ? i % 4 < 2
          ? "Smartphones"
          : "Laptops"
        : i % 4 < 2
          ? "T-Shirts"
          : "Hoodies";

    await prisma.product.create({
      data: {
        id: randomUUID(),

        title: `Demo Product ${i + 1}`,
        price: Math.floor(Math.random() * 500) + 10,
        quantity: Math.floor(Math.random() * 100),
        currency: "EUR",

        imageUrl: `https://picsum.photos/seed/prod-${i + 1}/600/800`,

        stock: Math.floor(Math.random() * 50),

        description:
          "A modern, clean demo product for testing e-commerce experiments.",

        extendedDescription:
          "This product is part of the DEMOSHOP demo catalog.",

        variants: {
          colors: ["Black", "White", "Midnight Blue", "Space Grey"],
          sizes: ["S", "M", "L", "XL"],
        },

        subcategoryId: subcategoryMap[subcategory],
      },
    });
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
