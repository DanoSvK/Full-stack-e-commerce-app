import { ShieldCheck, Shirt, Smartphone, Zap } from "lucide-react";
import CollectionPageCard from "../components/CollectionPageCard";

function CollectionsPage() {
  const COLLECTIONS = [
    {
      id: "titanium-flagships",
      kicker: "Collection 01 · Flagship Hardware",
      title: "Titanium Smartphones & OLED Ultrabooks",
      description:
        "Uncompromising mobile computing. Featuring the iPhone 15 Pro in Grade 5 Titanium, Galaxy S24 Ultra, Apple MacBook Air M3, and Dell XPS 13.",
      image: "https://picsum.photos/400/200?random=1",
      secondaryImage: "/product-images/laptops.jpg",
      stats: "15 Products · 2-Year Warranty · Free Express Courier",
      to: "/products?category=electronics",
      icon: Smartphone,
      subLinks: [
        { label: "Smartphones", to: "/products?subcategory=smartphones" },
        { label: "Laptops & Ultrabooks", to: "/products?subcategory=laptops" },
      ],
      orderImg: "lg:order-1",
      orderDetails: "lg:order-2",
    },
    {
      id: "heavyweight-streetwear",
      kicker: "Collection 02 · Urban Essentials",
      title: "440gsm Heavyweight Fleece & Combed Cotton",
      description:
        "Structured silhouettes built to hold their shape wash after wash. Discover Carhartt WIP Chase Hoodies, Champion Reverse Weave, and Uniqlo U heavyweight tees.",
      image: "https://picsum.photos/400/200?random=2",
      secondaryImage: "/product-images/tshirts.jpg",
      stats: "12 Products · S–XXL Sizing · 30-Day Free Exchanges",
      to: "/products?category=apparel",
      icon: Shirt,
      subLinks: [
        { label: "Pullover Hoodies", to: "/products?subcategory=hoodies" },
        { label: "Crewneck T-Shirts", to: "/products?subcategory=t-shirts" },
      ],
      orderImg: "lg:order-2",
      orderDetails: "lg:order-1",
    },
    {
      id: "performance-running",
      kicker: "Collection 03 · Athletic Engineering",
      title: "Dri-FIT & Pro Endurance Training Kit",
      description:
        "Moisture-wicking ultralight knits and laser-perforated woven running shorts with high-visibility reflective details for all-weather training.",
      image: "https://picsum.photos/400/200?random=3",
      secondaryImage: "/product-images/tshirts.jpg",
      stats: "4 Products · Breathable Technical Fabrics",
      to: "/products?category=sportswear",
      icon: Zap,
      subLinks: [
        { label: "Running Tops", to: "/products?subcategory=running-tops" },
        {
          label: "Training Shorts",
          to: "/products?subcategory=training-shorts",
        },
      ],
      orderImg: "lg:order-1",
      orderDetails: "lg:order-2",
    },
    {
      id: "certified-refurbished",
      kicker: "Collection 04 · Sustainable Tech",
      title: "Certified Refurbished Apple, Samsung & ThinkPad",
      description:
        "Every device passes a rigorous 40-point hardware diagnostic, battery health verification, and factory reset—complete with a 12-month warranty at up to 35% off retail.",
      image: "https://picsum.photos/400/200?random=4",
      secondaryImage: "/product-images/smartphones.jpg",
      stats: "9 Products · 40-Point Tested · 12-Month Warranty",
      to: "/products?category=refurbished",
      icon: ShieldCheck,
      subLinks: [
        {
          label: "Refurbished Phones",
          to: "/products?subcategory=refurbished-smartphones",
        },
        {
          label: "Refurbished Laptops",
          to: "/products?subcategory=refurbished-laptops",
        },
      ],
      orderImg: "lg:order-2",
      orderDetails: "lg:order-1",
    },
  ];

  return (
    <main className="space-y-16">
      <header className="max-w-3xl space-y-4">
        <p className="text-accent text-xs font-black uppercase tracking-widest">
          Curated Storefront Editions
        </p>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-header uppercase leading-none">
          Seasonal Collections
        </h1>
        <p className="text-main text-base sm:text-lg leading-relaxed">
          Explore our hand-picked departments across flagship hardware,
          certified refurbished devices, heavyweight streetwear, and technical
          sportswear.
        </p>
      </header>
      <section className="space-y-12">
        {COLLECTIONS.map((card) => {
          return (
            <CollectionPageCard
              key={card.id}
              kicker={card.kicker}
              title={card.title}
              description={card.description}
              image={card.image}
              stats={card.stats}
              to={card.to}
              Icon={card.icon}
              sublinks={card.subLinks}
              orderImg={card.orderImg}
              orderDetails={card.orderDetails}
            />
          );
        })}
      </section>
    </main>
  );
}

export default CollectionsPage;
