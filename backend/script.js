import prisma from "./lib/prisma.js";

async function main() {
  // 1. Seed base tables ONCE
  await prisma.category.createMany({
    data: [
      { name: "Electronics", slug: "electronics" },
      { name: "Apparel", slug: "apparel" },
    ],
    skipDuplicates: true,
  });

  await prisma.subcategory.createMany({
    data: [
      { name: "Smartphones", slug: "smartphones" },
      { name: "Laptops", slug: "laptops" },
      { name: "T-Shirts", slug: "t-shirts" },
      { name: "Hoodies", slug: "hoodies" },
    ],
    skipDuplicates: true,
  });

  // 2. Preload categories + subcategories into memory (IMPORTANT)
  const categories = await prisma.category.findMany();
  const subcategories = await prisma.subcategory.findMany();

  const categoryMap = Object.fromEntries(categories.map((c) => [c.name, c.id]));

  const subcategoryMap = Object.fromEntries(
    subcategories.map((s) => [s.name, s.id]),
  );

  // 3. Create products + relations
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

    const product = await prisma.product.create({
      data: {
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
      },
    });

    // 4. Product → Category
    await prisma.productCategory.create({
      data: {
        productId: product.id,
        categoryId: categoryMap[category],
      },
    });

    // 5. Product → Subcategory
    await prisma.productSubcategory.create({
      data: {
        productId: product.id,
        subcategoryId: subcategoryMap[subcategory],
      },
    });
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
