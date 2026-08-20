// Realistic demo catalog generator for e-commerce prototyping.
// Produces coherent, category-appropriate products instead of random noise:
// prices fit the product type, names/descriptions match the subcategory,
// and variants only appear where they make sense (no "sizes" on a laptop).

const CATALOG = {
  Electronics: {
    Smartphones: {
      brands: ["Apple", "Samsung", "Google", "OnePlus", "Xiaomi"],
      lines: [
        "iPhone 15 Pro",
        "iPhone 15",
        "Galaxy S24 Ultra",
        "Galaxy S24",
        "Pixel 9 Pro",
        "Pixel 9",
        "OnePlus 12",
        "Xiaomi 14",
      ],
      priceRange: [399, 1399],
      colors: ["Midnight Black", "Titanium Gray", "Sky Blue", "Cream White"],
      sizes: null,
      descriptionTemplate: (line) =>
        `The ${line} delivers a high-resolution OLED display, all-day battery life, and a pro-grade camera system for photos and video.`,
      extendedTemplate: (line, brand) =>
        `${line} from ${brand} pairs flagship performance with a durable aluminum-and-glass frame. Includes 5G connectivity, wireless charging, and the latest software updates for years to come.`,
    },
    Laptops: {
      brands: ["Apple", "Dell", "Lenovo", "ASUS", "HP"],
      lines: [
        'MacBook Air 13"',
        'MacBook Pro 14"',
        "XPS 13",
        "ThinkPad X1 Carbon",
        "ZenBook 14",
        "Spectre x360",
      ],
      priceRange: [699, 2499],
      colors: ["Silver", "Space Gray", "Graphite"],
      sizes: null,
      descriptionTemplate: (line) =>
        `The ${line} balances portability and performance, with a crisp display and a full workday of battery life.`,
      extendedTemplate: (line, brand) =>
        `Built by ${brand}, the ${line} features a fast SSD, ample RAM for multitasking, and a backlit keyboard. Ideal for work, study, or creative projects on the go.`,
    },
  },
  Apparel: {
    "T-Shirts": {
      brands: ["Nike", "Uniqlo", "H&M", "Everlane", "Champion"],
      lines: [
        "Essential Crew Neck Tee",
        "Dri-FIT Training Tee",
        "Organic Cotton Tee",
        "Classic Fit Tee",
        "Heavyweight Pocket Tee",
      ],
      priceRange: [12, 45],
      colors: ["Black", "White", "Heather Gray", "Navy", "Olive"],
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      descriptionTemplate: (line) =>
        `A ${line.toLowerCase()} made from soft, breathable fabric that holds its shape wash after wash.`,
      extendedTemplate: (line, brand) =>
        `${brand}'s ${line} is cut for everyday comfort with a tagless collar and reinforced seams. Machine washable and pre-shrunk.`,
    },
    Hoodies: {
      brands: ["Nike", "Champion", "Carhartt", "Patagonia", "Uniqlo"],
      lines: [
        "Fleece Pullover Hoodie",
        "Zip-Up Hoodie",
        "Heavyweight Hoodie",
        "Sherpa-Lined Hoodie",
        "Tech Fleece Hoodie",
      ],
      priceRange: [35, 120],
      colors: ["Black", "Charcoal", "Forest Green", "Burgundy", "Sand"],
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      descriptionTemplate: (line) =>
        `A ${line.toLowerCase()} with a brushed interior for warmth and a relaxed, everyday fit.`,
      extendedTemplate: (line, brand) =>
        `${brand}'s ${line} features a kangaroo pocket, adjustable drawstring hood, and ribbed cuffs. Durable enough for daily wear, soft enough to live in.`,
    },
  },
};

// --- Seeded PRNG ---------------------------------------------------------
// Array.from + Math.random regenerates a DIFFERENT random catalog every
// time this module runs (every page refresh, every server request, every
// hot-reload). That breaks lookups like `products.find(p => p.id === id)`
// after a refresh or direct navigation/copy-pasted link, because the id
// that's in the URL no longer matches any id in the newly-generated array.
// A seeded PRNG makes generation deterministic: same seed -> same output,
// every single time, so ids stay stable across reloads.
function createSeededRandom(seed) {
  let s = seed;
  return function random() {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}
const random = createSeededRandom(42);

function pick(arr) {
  return arr[Math.floor(random() * arr.length)];
}

function randomPrice([min, max]) {
  // Prices ending in .99 read as "real" rather than random integers.
  const whole = Math.floor(random() * (max - min + 1)) + min;
  return Number((whole - 0.01).toFixed(2));
}

// --- Realistic ID generators -------------------------------------------
// Pick whichever style matches the platform you're mimicking.

const CATEGORY_CODES = {
  Electronics: "ELEC",
  Apparel: "APRL",
};
const SUBCATEGORY_CODES = {
  Smartphones: "SP",
  Laptops: "LT",
  "T-Shirts": "TS",
  Hoodies: "HD",
};

function randomAlphaNum(length) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no O/0/I/1 (easy to misread)
  let out = "";
  for (let i = 0; i < length; i++)
    out += chars[Math.floor(random() * chars.length)];
  return out;
}

// Shopify/BigCommerce-style SKU: CATEGORY-SUBCAT-XXXXXX
function generateSku(category, subcategory) {
  const catCode =
    CATEGORY_CODES[category] ?? category.slice(0, 4).toUpperCase();
  const subCode =
    SUBCATEGORY_CODES[subcategory] ?? subcategory.slice(0, 2).toUpperCase();
  return `${catCode}-${subCode}-${randomAlphaNum(6)}`;
}

// Amazon-style ASIN: 1 letter + 9 alphanumeric, always 10 chars
function generateAsin() {
  return `B0${randomAlphaNum(8)}`;
}

// UUID v4 - what most modern backends (Postgres/Mongo) actually use as PK
function generateUuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const products = Array.from({ length: 48 }).map((_, i) => {
  const category = i % 2 === 0 ? "Electronics" : "Apparel";
  const subcategory =
    category === "Electronics"
      ? i % 4 < 2
        ? "Smartphones"
        : "Laptops"
      : i % 4 < 2
        ? "T-Shirts"
        : "Hoodies";

  const def = CATALOG[category][subcategory];
  const brand = pick(def.brands);
  const line = pick(def.lines);
  const name = `${brand} ${line}`;
  const stock = Math.floor(random() * 80);

  return {
    id: generateUuid(), // internal DB-style primary key
    sku: generateSku(category, subcategory), // human/ops-facing, shown in admin & order emails
    asin: generateAsin(), // marketplace-style listing id, e.g. for a multi-vendor catalog
    name,
    brand,
    price: randomPrice(def.priceRange),
    currency: "USD",
    image: `https://picsum.photos/seed/${encodeURIComponent(name)}-${i}/600/800`,
    category,
    subcategory,
    stock,
    inStock: stock > 0,
    rating: Number((3.5 + random() * 1.5).toFixed(1)), // 3.5–5.0, realistic spread
    reviewCount: Math.floor(random() * 2400) + 5,
    description: def.descriptionTemplate(line),
    extendedDescription: def.extendedTemplate(line, brand),
    variants: {
      colors: def.colors,
      ...(def.sizes ? { sizes: def.sizes } : {}),
    },
  };
});
