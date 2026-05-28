export const products = Array.from({ length: 48 }).map((_, i) => {
  const category = i % 2 === 0 ? "Electronics" : "Apparel";

  let subcategory;

  if (category === "Electronics") {
    subcategory = i % 4 < 2 ? "Smartphones" : "Laptops";
  } else {
    subcategory = i % 4 < 2 ? "T-Shirts" : "Hoodies";
  }

  return {
    id: `prod-${i + 1}`,
    name: `Demo Product ${i + 1}`,
    price: Math.floor(Math.random() * 500) + 10,
    currency: "USD",
    image: `https://picsum.photos/seed/prod-${i + 1}/600/800`,
    category,
    subcategory,
    stock: Math.floor(Math.random() * 50),
    description:
      "A modern, clean demo product for testing e-commerce experiments and weblayers.",
    extendedDescription:
      "This product is part of the DEMOSHOP demo catalog. It features high-quality materials and a modular design, perfect for testing various frontend layouts and backend integrations. Use this item to verify your catalog updates and weblayer triggers.",
    variants: {
      colors: ["Black", "White", "Midnight Blue", "Space Grey"],
      sizes: ["S", "M", "L", "XL"],
    },
  };
});
