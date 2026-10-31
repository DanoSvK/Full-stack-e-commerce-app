// backend/script.js
//
// Seeds the database with a realistic catalog.
// Safe to run repeatedly: categories, subcategories and products are upserted
// (matched by slug / title), and the old "Demo Product N" items are removed.
// Demo reviews are wiped and regenerated on every run (deterministically, so
// you get the same reviews each time).
//
// Prices are whole euros, matching how the frontend displays them
// (product.price.toFixed(2) €). If you switch to cents later, multiply by 100 here.
//
// Product names, specs and prices are approximate and for demo purposes only.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import prisma from "./lib/prisma.js";

// ---------------------------------------------------------------------------
// Taxonomy
// ---------------------------------------------------------------------------

const CATEGORIES = [
  { name: "Electronics", slug: "electronics" },
  { name: "Apparel", slug: "apparel" },
  { name: "Refurbished", slug: "refurbished" },
  { name: "Sportswear", slug: "sportswear" },
];

// A subcategory can belong to several categories (many-to-many).
const SUBCATEGORIES = [
  { name: "Smartphones", slug: "smartphones", categories: ["Electronics"] },
  { name: "Laptops", slug: "laptops", categories: ["Electronics"] },
  {
    name: "Refurbished Smartphones",
    slug: "refurbished-smartphones",
    categories: ["Refurbished", "Electronics"],
  },
  {
    name: "Refurbished Laptops",
    slug: "refurbished-laptops",
    categories: ["Refurbished", "Electronics"],
  },
  { name: "T-Shirts", slug: "t-shirts", categories: ["Apparel"] },
  { name: "Hoodies", slug: "hoodies", categories: ["Apparel"] },
  {
    name: "Running Tops",
    slug: "running-tops",
    categories: ["Sportswear", "Apparel"],
  },
  {
    name: "Training Shorts",
    slug: "training-shorts",
    categories: ["Sportswear", "Apparel"],
  },
];

// ---------------------------------------------------------------------------
// Products
//
// NOTE: the product page renders `variants.colors` as "Select Color" and
// `variants.sizes` as "Select Size", so both keys are required. For phones and
// laptops, "sizes" holds the storage options (specs such as RAM are kept in the
// description, because every option shares one price).
//
// Colours and storage tiers follow what each model is actually sold in.
// Clothing size runs differ per brand: streetwear/lifestyle cuts (Levi's,
// Carhartt WIP, Uniqlo) start at XS, performance lines start at S.
// ---------------------------------------------------------------------------

const SIZES_S_XXL = ["S", "M", "L", "XL", "XXL"];
const SIZES_XS_XXL = ["XS", "S", "M", "L", "XL", "XXL"];

const PRODUCTS = [
  // ===== Smartphones =====
  {
    subcategory: "Smartphones",
    title: "Apple iPhone 15",
    price: 829,
    stock: 24,
    description:
      "6.1-inch Super Retina XDR display, A16 Bionic chip, 48 MP main camera and USB-C.",
    extendedDescription:
      "The iPhone 15 brings the Dynamic Island, a 48 MP main camera with 2x optical-quality zoom and USB-C charging in a durable aluminium and colour-infused glass design. Includes Face ID and all-day battery life.",
    colors: ["Black", "Blue", "Green", "Yellow", "Pink"],
    sizes: ["128GB", "256GB", "512GB"],
  },
  {
    subcategory: "Smartphones",
    title: "Apple iPhone 15 Pro",
    price: 1099,
    stock: 12,
    description:
      "6.1-inch ProMotion display, A17 Pro chip, titanium design and a 48 MP camera system with 3x telephoto.",
    extendedDescription:
      "Built from aerospace-grade titanium, the iPhone 15 Pro adds the Action button, USB-C with USB 3 speeds and a Pro camera system for detailed photos and 4K video.",
    colors: [
      "Black Titanium",
      "White Titanium",
      "Blue Titanium",
      "Natural Titanium",
    ],
    sizes: ["128GB", "256GB", "512GB", "1TB"],
  },
  {
    subcategory: "Smartphones",
    title: "Samsung Galaxy S24",
    price: 799,
    stock: 18,
    description:
      "6.2-inch Dynamic AMOLED 2X display with 120 Hz refresh rate, 50 MP camera and Galaxy AI features.",
    extendedDescription:
      "A compact flagship with a bright adaptive-refresh display, a triple rear camera and Galaxy AI tools such as Live Translate and Circle to Search. Backed by seven years of OS and security updates.",
    colors: ["Onyx Black", "Marble Gray", "Cobalt Violet", "Amber Yellow"],
    sizes: ["128GB", "256GB", "512GB"],
  },
  {
    subcategory: "Smartphones",
    title: "Samsung Galaxy S24 Ultra",
    price: 1199,
    stock: 7,
    description:
      "6.8-inch Dynamic AMOLED 2X display, built-in S Pen, 200 MP main camera and a titanium frame.",
    extendedDescription:
      "The most powerful Galaxy S24 has a flat edge-to-edge display, a quad rear camera with 5x optical zoom, a built-in S Pen and the Snapdragon 8 Gen 3 for Galaxy processor.",
    colors: [
      "Titanium Black",
      "Titanium Gray",
      "Titanium Violet",
      "Titanium Yellow",
    ],
    sizes: ["256GB", "512GB", "1TB"],
  },
  {
    subcategory: "Smartphones",
    title: "Samsung Galaxy A55 5G",
    price: 449,
    stock: 40,
    description:
      "6.6-inch Super AMOLED display at 120 Hz, 50 MP camera with OIS and a 5,000 mAh battery.",
    extendedDescription:
      "A premium mid-range phone with a metal frame, IP67 water and dust resistance and four generations of Android updates.",
    colors: [
      "Awesome Iceblue",
      "Awesome Lilac",
      "Awesome Navy",
      "Awesome Lemon",
    ],
    sizes: ["128GB", "256GB"],
  },
  {
    subcategory: "Smartphones",
    title: "Google Pixel 8",
    price: 599,
    stock: 15,
    description:
      "6.2-inch Actua OLED display, Google Tensor G3 chip and a 50 MP camera with advanced AI photo tools.",
    extendedDescription:
      "Pixel 8 offers a clean Android experience, seven years of OS, security and Feature Drop updates, and photo features like Magic Eraser and Best Take.",
    colors: ["Obsidian", "Hazel", "Rose"],
    sizes: ["128GB", "256GB"],
  },
  {
    subcategory: "Smartphones",
    title: "Xiaomi 14T",
    price: 649,
    stock: 4,
    description:
      "6.67-inch 144 Hz AMOLED display, Leica-tuned triple camera system and 67 W fast charging.",
    extendedDescription:
      "Powered by the MediaTek Dimensity 8300-Ultra, the 14T pairs a bright 12-bit AMOLED display with a 50 MP main camera co-engineered with Leica and a 5,000 mAh battery.",
    colors: ["Titan Black", "Titan Gray", "Titan Blue", "Lemon Green"],
    sizes: ["256GB", "512GB"],
  },
  {
    subcategory: "Smartphones",
    title: "Nothing Phone (2a)",
    price: 329,
    stock: 5,
    description:
      "6.7-inch 120 Hz AMOLED display, transparent design with Glyph Interface and dual 50 MP cameras.",
    extendedDescription:
      "A distinctive mid-range phone with a transparent back and a customizable Glyph light interface, running the clean Nothing OS on a MediaTek Dimensity 7200 Pro chip.",
    colors: ["Black", "White"],
    sizes: ["128GB", "256GB"],
  },

  // ===== Laptops =====
  {
    subcategory: "Laptops",
    title: "Apple MacBook Air 13-inch (M3)",
    price: 1099,
    stock: 9,
    description:
      "13.6-inch Liquid Retina display, Apple M3 chip, fanless design and up to 18 hours of battery life.",
    extendedDescription:
      "Thin, light and completely silent, the MacBook Air with M3 handles everyday work, photo editing and light video projects with ease. Comes with a 1080p camera, MagSafe charging and macOS.",
    colors: ["Midnight", "Starlight", "Space Grey", "Silver"],
    sizes: ["256GB", "512GB", "1TB"],
  },
  {
    subcategory: "Laptops",
    title: "Dell XPS 13",
    price: 1299,
    stock: 5,
    description:
      "13.4-inch InfinityEdge display in a compact aluminium chassis built for travel and everyday work.",
    extendedDescription:
      "A premium ultraportable with a near edge-to-edge display, a roomy keyboard and a precision-machined aluminium body. Configurations vary by region.",
    colors: ["Platinum", "Graphite"],
    sizes: ["512GB", "1TB"],
  },
  {
    subcategory: "Laptops",
    title: "Lenovo ThinkPad E14",
    price: 749,
    stock: 14,
    description:
      "14-inch business laptop with a comfortable ThinkPad keyboard, Full HD+ display and fingerprint reader.",
    extendedDescription:
      "Designed for work, with a comfortable keyboard, HDMI and USB-C ports, a webcam privacy shutter and a build tested against MIL-STD-810H durability standards.",
    colors: ["Graphite Black", "Silver"],
    sizes: ["256GB", "512GB", "1TB"],
  },
  {
    subcategory: "Laptops",
    title: "ASUS Zenbook 14 OLED",
    price: 999,
    stock: 11,
    description:
      "14-inch 2.8K OLED display in a lightweight aluminium body with long battery life.",
    extendedDescription:
      "A slim, light laptop with a vivid OLED panel, an Intel Core Ultra processor and a backlit keyboard, well suited to creative work and travel.",
    colors: ["Ponder Blue", "Foggy Silver"],
    sizes: ["512GB", "1TB"],
  },
  {
    subcategory: "Laptops",
    title: "HP Pavilion 15",
    price: 649,
    stock: 22,
    description:
      "15.6-inch Full HD laptop with an Intel Core i5 processor, 16 GB RAM and a fast SSD for everyday use.",
    extendedDescription:
      "A reliable all-rounder for study and home office, with a full-size keyboard and numeric pad, an HD webcam and Wi-Fi 6.",
    colors: ["Natural Silver", "Warm Gold", "Fog Blue"],
    sizes: ["256GB", "512GB"],
  },
  {
    subcategory: "Laptops",
    title: "Acer Aspire 5",
    price: 549,
    stock: 30,
    description:
      "15.6-inch Full HD laptop with a modern Intel Core processor, 16 GB RAM and a fast SSD.",
    extendedDescription:
      "A budget-friendly everyday laptop with a slim metal cover, a backlit keyboard and a good selection of ports including HDMI and USB-C.",
    colors: ["Steel Gray"],
    sizes: ["512GB", "1TB"],
  },
  {
    subcategory: "Laptops",
    title: "Lenovo IdeaPad Slim 3",
    price: 479,
    stock: 35,
    description:
      "15.6-inch laptop with an AMD Ryzen 5 processor, 16 GB RAM and a quick SSD for study and office work.",
    extendedDescription:
      "A light, affordable laptop with a webcam privacy shutter, a full-size keyboard and all-day battery life for classes, browsing and documents.",
    colors: ["Arctic Grey", "Abyss Blue"],
    sizes: ["256GB", "512GB"],
  },

  // ===== Refurbished Smartphones =====
  {
    subcategory: "Refurbished Smartphones",
    title: "Apple iPhone 13 (Refurbished, Excellent)",
    price: 429,
    stock: 16,
    description:
      "Professionally tested iPhone 13 with a 6.1-inch OLED display, A15 Bionic chip and dual 12 MP cameras.",
    extendedDescription:
      "Graded Excellent: minimal signs of wear, fully tested and reset to factory settings. Includes a 12-month warranty and a 30-day return period.",
    colors: ["Midnight", "Starlight", "Blue", "Pink"],
    sizes: ["128GB", "256GB"],
  },
  {
    subcategory: "Refurbished Smartphones",
    title: "Apple iPhone 12 (Refurbished, Good)",
    price: 289,
    stock: 8,
    description:
      "Refurbished iPhone 12 with a 6.1-inch Super Retina XDR display, A14 Bionic chip and 5G support.",
    extendedDescription:
      "Graded Good: visible light scratches on the frame or back, screen in great condition. Fully tested, with a 12-month warranty and a 30-day return period.",
    colors: ["Black", "White", "Blue"],
    sizes: ["64GB", "128GB"],
  },
  {
    subcategory: "Refurbished Smartphones",
    title: "Samsung Galaxy S22 (Refurbished, Excellent)",
    price: 299,
    stock: 6,
    description:
      "Refurbished Galaxy S22 with a 6.1-inch Dynamic AMOLED 2X display, triple camera and 5G.",
    extendedDescription:
      "Graded Excellent: minimal signs of wear and fully tested. Includes a 12-month warranty and a 30-day return period.",
    colors: ["Phantom Black", "Phantom White", "Green"],
    sizes: ["128GB", "256GB"],
  },
  {
    subcategory: "Refurbished Smartphones",
    title: "Google Pixel 7 (Refurbished, Good)",
    price: 229,
    stock: 3,
    description:
      "Refurbished Pixel 7 with a 6.3-inch OLED display, Google Tensor G2 chip and a 50 MP camera.",
    extendedDescription:
      "Graded Good: light cosmetic wear, fully tested and reset. Includes a 12-month warranty and a 30-day return period.",
    colors: ["Obsidian", "Snow", "Lemongrass"],
    sizes: ["128GB", "256GB"],
  },
  {
    subcategory: "Refurbished Smartphones",
    title: "Apple iPhone 11 (Refurbished, Fair)",
    price: 199,
    stock: 0,
    description:
      "Budget-friendly refurbished iPhone 11 with a 6.1-inch Liquid Retina display and dual 12 MP cameras.",
    extendedDescription:
      "Graded Fair: visible signs of wear such as scratches or small dents, fully functional and tested. Includes a 12-month warranty and a 30-day return period.",
    colors: ["Black", "White", "Purple"],
    sizes: ["64GB", "128GB"],
  },

  // ===== Refurbished Laptops =====
  {
    subcategory: "Refurbished Laptops",
    title: "Apple MacBook Air 13-inch M1 (Refurbished, Excellent)",
    price: 649,
    stock: 6,
    description:
      "Refurbished MacBook Air with the Apple M1 chip, 13.3-inch Retina display and up to 15 hours of battery.",
    extendedDescription:
      "Graded Excellent: minimal signs of wear, battery tested and fully reset. Includes a charger, a 12-month warranty and a 30-day return period.",
    colors: ["Space Grey", "Silver", "Gold"],
    sizes: ["256GB", "512GB"],
  },
  {
    subcategory: "Refurbished Laptops",
    title: "Lenovo ThinkPad T480 (Refurbished, Good)",
    price: 349,
    stock: 10,
    description:
      "Refurbished 14-inch business laptop with an Intel Core i5 processor, 16 GB RAM and a fast SSD.",
    extendedDescription:
      "A proven workhorse with a great keyboard and swappable battery design. Graded Good: light cosmetic wear, fully tested, with a 12-month warranty.",
    colors: ["Black"],
    sizes: ["256GB", "512GB"],
  },
  {
    subcategory: "Refurbished Laptops",
    title: "Dell Latitude 7420 (Refurbished, Excellent)",
    price: 489,
    stock: 4,
    description:
      "Refurbished 14-inch business ultrabook with an 11th-gen Intel Core i5, 16 GB RAM and a fast SSD.",
    extendedDescription:
      "A slim, lightweight business laptop with a backlit keyboard and fast Thunderbolt 4 ports. Graded Excellent, fully tested, with a 12-month warranty.",
    colors: ["Carbon Fiber Black"],
    sizes: ["256GB", "512GB"],
  },
  {
    subcategory: "Refurbished Laptops",
    title: "HP EliteBook 840 G7 (Refurbished, Good)",
    price: 399,
    stock: 7,
    description:
      "Refurbished 14-inch laptop with a 10th-gen Intel Core i5, 16 GB RAM and a fast SSD for office work.",
    extendedDescription:
      "A durable business laptop with a spill-resistant keyboard and a fingerprint reader. Graded Good: light cosmetic wear, fully tested, with a 12-month warranty.",
    colors: ["Silver"],
    sizes: ["256GB", "512GB"],
  },

  // ===== T-Shirts =====
  {
    subcategory: "T-Shirts",
    title: "Nike Sportswear Club T-Shirt",
    price: 29,
    stock: 60,
    description:
      "Soft cotton jersey crew-neck tee with a relaxed fit and an embroidered logo.",
    extendedDescription:
      "An everyday essential made from breathable cotton jersey with a classic crew neck and a comfortable, slightly relaxed fit. Machine washable.",
    colors: ["Black", "White", "Dark Grey Heather", "Olive"],
    sizes: SIZES_S_XXL,
  },
  {
    subcategory: "T-Shirts",
    title: "Adidas Essentials Single Jersey T-Shirt",
    price: 25,
    stock: 45,
    description:
      "Classic crew-neck tee in soft single jersey cotton with a regular fit.",
    extendedDescription:
      "A simple, versatile tee made from 100% cotton single jersey with a ribbed crew neck. Easy to layer and easy to wear every day.",
    colors: ["Black", "White", "Navy"],
    sizes: SIZES_S_XXL,
  },
  {
    subcategory: "T-Shirts",
    title: "Levi's Housemark Graphic T-Shirt",
    price: 30,
    stock: 35,
    description:
      "Everyday cotton tee with the iconic Levi's batwing logo on the chest.",
    extendedDescription:
      "A relaxed, classic tee made from soft cotton jersey with a chest logo graphic. Pairs with jeans, shorts or layered under a jacket.",
    colors: ["White", "Black", "Dress Blues"],
    sizes: SIZES_XS_XXL,
  },
  {
    subcategory: "T-Shirts",
    title: "Carhartt WIP Chase T-Shirt",
    price: 45,
    stock: 5,
    description:
      "Midweight cotton tee with a small embroidered Chase logo on the chest.",
    extendedDescription:
      "A durable, regular-fit tee in soft cotton jersey with a ribbed collar and a signature embroidered logo, built to hold its shape wash after wash.",
    colors: ["Black", "White", "Dark Navy", "Hamilton Brown"],
    sizes: SIZES_XS_XXL,
  },
  {
    subcategory: "T-Shirts",
    title: "Uniqlo U Crew Neck T-Shirt",
    price: 20,
    stock: 80,
    description:
      "Heavyweight cotton crew-neck tee with a clean, slightly boxy cut.",
    extendedDescription:
      "A thick, structured cotton tee with a wide crew neck and a modern boxy fit. A simple wardrobe basic that works on its own or layered.",
    colors: ["White", "Black", "Grey", "Beige"],
    sizes: SIZES_XS_XXL,
  },
  {
    subcategory: "T-Shirts",
    title: "Champion Classic Crewneck T-Shirt",
    price: 25,
    stock: 28,
    description:
      "Classic fit cotton tee with the Champion C logo on the sleeve.",
    extendedDescription:
      "A soft, durable cotton jersey tee with a ribbed crew neck and a small embroidered logo on the sleeve. A timeless sportswear-inspired basic.",
    colors: ["Oxford Grey", "Black", "White", "Navy"],
    sizes: SIZES_S_XXL,
  },

  // ===== Hoodies =====
  {
    subcategory: "Hoodies",
    title: "Nike Sportswear Club Fleece Pullover Hoodie",
    price: 65,
    stock: 30,
    description:
      "Soft brushed-back fleece pullover hoodie with a kangaroo pocket and a classic fit.",
    extendedDescription:
      "A warm, comfortable hoodie with a drawcord hood, ribbed cuffs and hem, and a front pouch pocket. A staple for cooler days and casual layering.",
    colors: ["Black", "Dark Grey Heather", "Navy", "Olive"],
    sizes: SIZES_S_XXL,
  },
  {
    subcategory: "Hoodies",
    title: "Adidas Essentials Fleece Hoodie",
    price: 60,
    stock: 22,
    description:
      "Cosy fleece hoodie with a drawcord hood, kangaroo pocket and a regular fit.",
    extendedDescription:
      "Made from a soft cotton-blend fleece with a smooth outside and a brushed inside. Ribbed cuffs and hem keep the cold out.",
    colors: ["Black", "Medium Grey Heather", "Team Navy"],
    sizes: SIZES_S_XXL,
  },
  {
    subcategory: "Hoodies",
    title: "Champion Reverse Weave Hoodie",
    price: 80,
    stock: 12,
    description:
      "Heavyweight Reverse Weave fleece hoodie designed to resist shrinking and keep its shape.",
    extendedDescription:
      "A heritage hoodie woven crosswise to reduce shrinkage, with side gussets for flexibility, a lined hood and a front pouch pocket.",
    colors: ["Oxford Grey", "Black", "Navy"],
    sizes: SIZES_S_XXL,
  },
  {
    subcategory: "Hoodies",
    title: "Carhartt WIP Hooded Chase Sweatshirt",
    price: 100,
    stock: 4,
    description:
      "Heavy cotton-blend hooded sweatshirt with a small Chase logo and a regular fit.",
    extendedDescription:
      "A durable, brushed-fleece hoodie with a double-layered hood, kangaroo pocket and ribbed trims. Built to be worn hard and still look good.",
    colors: ["Black", "Dark Navy", "Hamilton Brown"],
    sizes: SIZES_XS_XXL,
  },
  {
    subcategory: "Hoodies",
    title: "Levi's Standard Housemark Hoodie",
    price: 70,
    stock: 18,
    description:
      "Soft cotton-blend fleece hoodie with a chest logo and a comfortable standard fit.",
    extendedDescription:
      "An easy everyday hoodie with a lined hood, kangaroo pocket and ribbed cuffs. Wears well with jeans and sneakers.",
    colors: ["Black", "Grey Heather", "Navy"],
    sizes: SIZES_XS_XXL,
  },
  {
    subcategory: "Hoodies",
    title: "Puma Essentials Big Logo Hoodie",
    price: 55,
    stock: 0,
    description:
      "Comfortable brushed-fleece hoodie with a large Puma logo across the chest.",
    extendedDescription:
      "A relaxed-fit hoodie with a drawcord hood, kangaroo pocket and ribbed cuffs and hem. Soft inside and easy to layer.",
    colors: ["Black", "Light Grey Heather", "Navy"],
    sizes: SIZES_S_XXL,
  },

  // ===== Running Tops =====
  {
    subcategory: "Running Tops",
    title: "Nike Dri-FIT Miler Running Top",
    price: 35,
    stock: 40,
    description:
      "Lightweight short-sleeve running top with sweat-wicking Dri-FIT fabric and a relaxed fit.",
    extendedDescription:
      "Soft, breathable fabric that moves sweat away from your skin keeps you dry on easy runs and tough workouts, with reflective details for visibility.",
    colors: ["Black", "White", "Royal Blue", "Volt"],
    sizes: SIZES_S_XXL,
  },
  {
    subcategory: "Running Tops",
    title: "Adidas Own the Run T-Shirt",
    price: 30,
    stock: 26,
    description:
      "Moisture-absorbing running tee with reflective details and a lightweight feel.",
    extendedDescription:
      "Made with recycled materials and AEROREADY moisture management, this tee keeps you comfortable on runs in any weather and stays visible in low light.",
    colors: ["Black", "White", "Semi Solar Green"],
    sizes: SIZES_S_XXL,
  },
  {
    subcategory: "Running Tops",
    title: "Under Armour Tech 2.0 Short Sleeve Top",
    price: 28,
    stock: 33,
    description:
      "Quick-drying, ultra-soft training top with an anti-odor finish and a loose, comfortable fit.",
    extendedDescription:
      "A lightweight tee with a soft, textured fabric that dries fast and resists odor, making it suitable for running, gym sessions and everyday wear.",
    colors: ["Black", "Academy Blue", "Pitch Gray"],
    sizes: SIZES_S_XXL,
  },
  {
    subcategory: "Running Tops",
    title: "Puma Run Favorite T-Shirt",
    price: 25,
    stock: 19,
    description:
      "Lightweight running tee with moisture-wicking dryCELL technology and a regular fit.",
    extendedDescription:
      "Designed for regular runs, this tee uses dryCELL fabric to pull moisture away from the body and has reflective details for safer evening running.",
    colors: ["Black", "Puma White", "Electric Blue"],
    sizes: SIZES_S_XXL,
  },

  // ===== Training Shorts =====
  {
    subcategory: "Training Shorts",
    title: "Nike Dri-FIT Challenger Running Shorts",
    price: 40,
    stock: 25,
    description:
      "Lightweight, breathable running shorts with Dri-FIT fabric and a brief liner.",
    extendedDescription:
      "Mesh panels and sweat-wicking fabric keep you cool, while the built-in brief liner and zip pocket handle comfort and small essentials on the run.",
    colors: ["Black", "Navy", "Grey"],
    sizes: SIZES_S_XXL,
  },
  {
    subcategory: "Training Shorts",
    title: "Adidas Own the Run Shorts",
    price: 35,
    stock: 17,
    description:
      "Lightweight running shorts with moisture-absorbing fabric and reflective details.",
    extendedDescription:
      "Made with recycled materials, these shorts feature an elastic waistband with a drawcord, a zip pocket and AEROREADY fabric to keep you dry.",
    colors: ["Black", "Navy", "Solar Red"],
    sizes: SIZES_XS_XXL,
  },
  {
    subcategory: "Training Shorts",
    title: "Under Armour Launch Running Shorts",
    price: 35,
    stock: 14,
    description:
      "Lightweight, quick-drying running shorts with a built-in liner and a secure back pocket.",
    extendedDescription:
      "Stretchy, breathable woven fabric with mesh ventilation and reflective details for visibility. Built for daily runs and fast workouts.",
    colors: ["Black", "Pitch Gray", "Midnight Navy"],
    sizes: SIZES_S_XXL,
  },
  {
    subcategory: "Training Shorts",
    title: "Puma Run Favorite Woven Shorts",
    price: 30,
    stock: 9,
    description:
      "Lightweight woven running shorts with dryCELL moisture control and an elastic waistband.",
    extendedDescription:
      "Easy, breathable shorts for everyday runs, with a drawcord waist, side vents for movement and a small back pocket for keys or a card.",
    colors: ["Black", "Puma White", "Peacoat"],
    sizes: SIZES_S_XXL,
  },
];

// ---------------------------------------------------------------------------
// Demo reviews
//
// Each product gets its own review count (0 to ~45) and its own "quality"
// level, so some products are loved, some are mixed, and some barely have any
// reviews. Everything is driven by a seeded random generator (seeded from the
// product title), so re-running the script produces identical data.
// ---------------------------------------------------------------------------

// Needs to be >= the largest possible review count per product, because a user
// can only review a product once (composite unique key).
const DEMO_REVIEWER_COUNT = 60;

// Synthetic accounts used only for local/demo data.
// Passwords are intentionally omitted because the schema allows password=null.
const DEMO_REVIEWERS = Array.from({ length: DEMO_REVIEWER_COUNT }, (_, i) => ({
  email: `reviewer${i + 1}@example.com`,
  username: `reviewer${i + 1}`,
}));

// Comment building blocks per subcategory.
// pros: full sentences. cons: lowercase clauses (they get slotted into
// sentences like "Only complaint: <con>." or "However, <con>.").
const REVIEW_PARTS = {
  Smartphones: {
    pros: [
      "The display is bright and sharp.",
      "Performance is smooth in everyday use.",
      "The camera takes great photos, even in low light.",
      "Battery easily lasts a full day.",
      "Setup was quick and painless.",
      "It feels well built and premium in the hand.",
    ],
    cons: [
      "the battery drains faster than I expected",
      "it gets warm when gaming or filming video",
      "the price feels high for what you get",
      "the camera struggles in low light",
      "charging is slower than I hoped",
    ],
  },
  Laptops: {
    pros: [
      "The keyboard is comfortable for long typing sessions.",
      "The screen looks great.",
      "It handles all my usual apps without slowing down.",
      "It is light enough to carry around all day.",
      "Battery lasts a full work day.",
      "Boots up quickly and feels responsive.",
    ],
    cons: [
      "battery life is only average",
      "the fan gets loud under load",
      "the speakers are weak",
      "the display could be brighter",
      "the trackpad feels a bit cheap",
    ],
  },
  "Refurbished Smartphones": {
    pros: [
      "It arrived clean, reset and well packaged.",
      "The cosmetic condition matched the grade.",
      "Battery health was better than I expected.",
      "Works like a new phone for a lot less money.",
      "Everything I tested works perfectly.",
    ],
    cons: [
      "there are more scratches than the listing suggested",
      "the battery health is lower than I hoped",
      "the screen has a few visible marks",
      "delivery took longer than expected",
      "the back of the phone has some scuffs",
    ],
  },
  "Refurbished Laptops": {
    pros: [
      "It arrived in very good condition with a clean install.",
      "Great value for an office machine.",
      "The keyboard feels barely used.",
      "Performance is perfectly fine for everyday work.",
      "Battery holds up well for its age.",
    ],
    cons: [
      "the battery life is shorter than I hoped",
      "there are noticeable scuffs on the lid",
      "the fan is noisier than I expected",
      "the screen is a little dim",
      "some of the keys show wear",
    ],
  },
  "T-Shirts": {
    pros: [
      "The fabric is soft and breathable.",
      "The fit is true to size.",
      "It kept its shape after several washes.",
      "The cut looks clean and goes with everything.",
      "Good quality for the price.",
    ],
    cons: [
      "the fabric is thinner than I prefer",
      "it shrank slightly in the wash",
      "the sizing runs a bit small",
      "the collar stretched out after a few washes",
      "the colour faded faster than expected",
    ],
  },
  Hoodies: {
    pros: [
      "The inside is soft and warm.",
      "The fabric feels thick and substantial.",
      "The hood sits nicely and the drawcord is sturdy.",
      "The fit is comfortable and not too boxy.",
      "The cuffs and hem hold their shape.",
    ],
    cons: [
      "it is not as warm as I expected",
      "it started pilling after a few washes",
      "the sizing runs large",
      "the fabric is thinner than the photos suggest",
      "the pocket is a bit shallow",
    ],
  },
  "Running Tops": {
    pros: [
      "The fabric is light and dries quickly.",
      "No chafing, even on long runs.",
      "Breathable and comfortable when I sweat a lot.",
      "The reflective details are a nice touch.",
      "The fit is comfortable and does not ride up.",
    ],
    cons: [
      "it holds odour after a few runs",
      "the fabric feels a bit scratchy",
      "the fit is looser than I expected",
      "the seams rubbed a little on longer runs",
      "the colour looks different from the photos",
    ],
  },
  "Training Shorts": {
    pros: [
      "Light and comfortable, with good freedom of movement.",
      "The waistband stays put while running.",
      "The pocket is big enough for keys and a card.",
      "Breathable fabric that dries quickly.",
      "The liner is comfortable and does not bunch up.",
    ],
    cons: [
      "the waistband loosens when I run",
      "the liner rides up",
      "the pocket is too small for a phone",
      "the sizing runs small",
      "the fabric is a bit noisy",
    ],
  },
};

const REVIEW_OPENERS = {
  5: [
    "Excellent purchase.",
    "Really happy with this.",
    "Exactly what I was looking for.",
    "Absolutely love it.",
  ],
  4: [
    "Very good overall.",
    "Happy with this purchase.",
    "Solid choice.",
    "Good value for money.",
  ],
  3: [
    "It is okay.",
    "Decent, but not perfect.",
    "Average overall.",
    "Does the job.",
  ],
  2: [
    "Disappointed.",
    "Not quite what I hoped for.",
    "Underwhelming.",
    "Below my expectations.",
  ],
  1: [
    "Would not recommend.",
    "Very disappointed.",
    "Not worth the money.",
    "Poor experience.",
  ],
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

// Small deterministic PRNG (mulberry32) so seeded data is reproducible.
const hashString = (str) => {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

const createRng = (seed) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const pick = (rng, list) => list[Math.floor(rng() * list.length)];

const shuffle = (rng, list) => {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

// How many reviews a product gets: a few barely-reviewed items, some with a
// handful, and some popular ones with dozens.
const reviewCountFor = (rng) => {
  const roll = rng();
  if (roll < 0.1) return Math.floor(rng() * 3); // 0-2
  if (roll < 0.35) return 3 + Math.floor(rng() * 6); // 3-8
  if (roll < 0.75) return 9 + Math.floor(rng() * 12); // 9-20
  return 21 + Math.floor(rng() * 25); // 21-45
};

// Average "true" quality of a product, between roughly 2.8 and 4.8.
const qualityFor = (rng, subcategoryName) => {
  const base = 3.0 + rng() * 1.8;
  const penalty = subcategoryName.startsWith("Refurbished") ? 0.2 : 0;
  return Math.min(4.8, Math.max(2.8, base - penalty));
};

// Draw a 1-5 rating clustered around the product's quality, so a 4.6 product
// gets mostly 5s and 4s, while a 3.0 product gets a real spread including 1s.
const sampleRating = (rng, quality) => {
  const weights = [1, 2, 3, 4, 5].map(
    (r) =>
      Math.exp(-((r - quality) ** 2) / (2 * 0.8 ** 2)) * (r === 5 ? 1.15 : 1) +
      0.03,
  );
  const total = weights.reduce((sum, w) => sum + w, 0);
  let roll = rng() * total;

  for (let i = 0; i < weights.length; i++) {
    roll -= weights[i];
    if (roll <= 0) return i + 1;
  }
  return 5;
};

const buildReviewTitle = (rng, rating) => {
  return pick(rng, REVIEW_OPENERS[rating]);
};

const buildComment = (rng, subcategoryName, rating) => {
  const parts = REVIEW_PARTS[subcategoryName] ?? REVIEW_PARTS.Smartphones;
  const [pro1, pro2] = shuffle(rng, parts.pros);
  const con = pick(rng, parts.cons);

  let body;

  if (rating === 5) {
    body = rng() < 0.4 ? [pro1] : [pro1, pro2];
  } else if (rating === 4) {
    body = [pro1, `Only complaint: ${con}.`];
  } else if (rating === 3) {
    body = [pro1, `However, ${con}.`];
  } else {
    body = [`${capitalize(con)}.`];
  }

  return body.join(" ");
};

const buildReviewsForProduct = (product, reviewerIds) => {
  const rng = createRng(hashString(product.title));
  const subcategoryName = product.subcategory.name;

  const count = reviewCountFor(rng);
  const quality = qualityFor(rng, subcategoryName);
  const reviewers = shuffle(rng, reviewerIds).slice(0, count);

  const usedComments = new Set();

  return reviewers.map((userId) => {
    const rating = sampleRating(rng, quality);

    const title = buildReviewTitle(rng, rating);

    let comment = buildComment(rng, subcategoryName, rating);

    for (let attempt = 0; attempt < 6 && usedComments.has(comment); attempt++) {
      comment = buildComment(rng, subcategoryName, rating);
    }

    usedComments.add(comment);

    return {
      userId,
      productId: product.id,
      title,
      rating,
      comment,
      status: "APPROVED",
    };
  });
};

// If you ran `node fetchImages.js`, on-topic Pexels photos live in
// frontend/public/product-images and are listed in manifest.json.
// Delete manifest.json to go back to random images.
const loadManifest = () => {
  try {
    const file = path.resolve(
      __dirname,
      "../frontend/public/product-images/manifest.json",
    );
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return null;
  }
};

const MANIFEST = loadManifest();

// Products in the same subcategory get different photos from that subcategory's
// pool (and wrap around if there are more products than photos).
// The path is relative, so the frontend serves it from its own public/ folder.
// Without a manifest we fall back to random picsum.photos images, seeded by
// title so each product always gets the same image.
const imageFor = (title, subcategorySlug, indexInSubcategory) => {
  const pool = MANIFEST?.[subcategorySlug];

  if (pool?.length) {
    return `/product-images/${pool[indexInSubcategory % pool.length].file}`;
  }

  return `https://picsum.photos/seed/${slugify(title)}/600/800`;
};

// ---------------------------------------------------------------------------
// Seeding
// ---------------------------------------------------------------------------

async function main() {
  // 0. Remove the old generic demo products
  const removed = await prisma.product.deleteMany({
    where: { title: { startsWith: "Demo Product" } },
  });
  if (removed.count > 0) {
    console.log(`Removed ${removed.count} old demo products`);
  }

  // 1. Categories
  const categoryIds = {};
  for (const category of CATEGORIES) {
    const saved = await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name },
      create: category,
    });
    categoryIds[category.name] = saved.id;
  }

  // 2. Subcategories + links to categories (many-to-many)
  const subcategoryIds = {};
  for (const sub of SUBCATEGORIES) {
    const saved = await prisma.subcategory.upsert({
      where: { slug: sub.slug },
      update: { name: sub.name },
      create: { name: sub.name, slug: sub.slug },
    });
    subcategoryIds[sub.name] = saved.id;

    // Reset links so changes to the taxonomy above take effect on re-seed
    await prisma.categorySubcategory.deleteMany({
      where: { subcategoryId: saved.id },
    });
    await prisma.categorySubcategory.createMany({
      data: sub.categories.map((categoryName) => ({
        categoryId: categoryIds[categoryName],
        subcategoryId: saved.id,
      })),
    });
  }

  // 3. Products
  const slugByName = Object.fromEntries(
    SUBCATEGORIES.map((sub) => [sub.name, sub.slug]),
  );
  const countBySubcategory = {};

  for (const item of PRODUCTS) {
    const index = countBySubcategory[item.subcategory] ?? 0;
    countBySubcategory[item.subcategory] = index + 1;

    const data = {
      title: item.title,
      description: item.description,
      extendedDescription: item.extendedDescription,
      price: item.price,
      stock: item.stock,
      imageUrl: imageFor(item.title, slugByName[item.subcategory], index),
      variants: { colors: item.colors, sizes: item.sizes },
      subcategoryId: subcategoryIds[item.subcategory],
    };

    await prisma.product.upsert({
      where: { title: item.title },
      update: data,
      create: data,
    });
  }

  // 4. Create/reuse demo reviewers
  const reviewerIds = [];

  for (const reviewer of DEMO_REVIEWERS) {
    const user = await prisma.user.upsert({
      where: { email: reviewer.email },
      update: {},
      create: reviewer,
    });

    reviewerIds.push(user.id);
  }

  // 5. Regenerate demo reviews.
  // Old demo reviews are cleared first, so changing the generator above
  // (or the number of reviews per product) never leaves stale rows behind.
  const cleared = await prisma.review.deleteMany({
    where: { userId: { in: reviewerIds } },
  });
  if (cleared.count > 0) {
    console.log(`Cleared ${cleared.count} old demo reviews`);
  }

  const seededProducts = await prisma.product.findMany({
    where: { title: { in: PRODUCTS.map((p) => p.title) } },
    select: {
      id: true,
      title: true,
      subcategory: {
        select: { name: true },
      },
    },
    orderBy: { title: "asc" },
  });

  const allReviews = seededProducts.flatMap((product) =>
    buildReviewsForProduct(product, reviewerIds),
  );

  await prisma.review.createMany({ data: allReviews });

  // 6. Recalculate each product's average rating and approved review count.
  for (const product of seededProducts) {
    const aggregate = await prisma.review.aggregate({
      where: {
        productId: product.id,
        status: "APPROVED",
      },
      _avg: { rating: true },
      _count: { _all: true },
    });

    await prisma.product.update({
      where: { id: product.id },
      data: {
        ratingsAverage: aggregate._avg.rating
          ? Math.round(aggregate._avg.rating * 10) / 10
          : 0,
        ratingsQuantity: aggregate._count._all,
      },
    });
  }

  console.log(
    `Seeded ${CATEGORIES.length} categories, ${SUBCATEGORIES.length} subcategories, ${PRODUCTS.length} products and ${allReviews.length} reviews`,
  );
  console.log(
    MANIFEST
      ? "Images: local Pexels photos (frontend/public/product-images)"
      : "Images: random picsum.photos (run `node fetchImages.js` for on-topic photos)",
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
