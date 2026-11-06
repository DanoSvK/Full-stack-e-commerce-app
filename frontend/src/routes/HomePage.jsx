import Hero from "../components/Hero";
import PageCard from "../components/PageCard";
import { Smartphone, Shirt, Zap, ShieldCheck } from "lucide-react";
import ProductList from "../features/products/ProductList";
import { useProducts } from "../features/products/useProducts";
import ProductListSkeleton from "../components/skeletons/ProductListSkeleton";
import LoaderError from "../ui/LoaderError";

function HomePage() {
  const {
    data: productsData,
    isPending: isLoadingProducts,
    error: productsError,
  } = useProducts({ take: 6 });

  if (isLoadingProducts) {
    return <ProductListSkeleton length={6} />;
  }

  const products = productsData?.products ?? [];

  if (productsError) {
    return <LoaderError />;
  }

  return (
    <div className="space-y-24">
      <Hero />
      <section
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 scroll-mt-22"
        id="home-cards"
      >
        <PageCard
          content={{
            icon: Smartphone,
            title: "Electronics",
            description:
              "Flagship titanium smartphones and M-series OLED ultrabooks engineered for pro workflows.",
            linkText: "Shop Electronics",
            textColor: "text-blue-400",
            bgColor: "bg-blue-400/10",
            to: "/products?category=electronics",
          }}
        />
        <PageCard
          content={{
            icon: Shirt,
            title: "Apparel",
            description:
              " 440gsm brushed-fleece hoodies and structured heavyweight cotton crewnecks.",
            linkText: "Shop Apparel",
            textColor: "text-purple-400",
            bgColor: "bg-purple-400/10",
            to: "/products?category=apparel",
          }}
        />
        <PageCard
          content={{
            icon: Zap,
            title: "Sportwear",
            description:
              "Sweat-wicking Dri-FIT running tops and laser-perforated training shorts.",
            linkText: "Shop Sportwear",
            textColor: "text-accent",
            bgColor: "bg-accent/10",
            to: "/products?category=sportwear",
          }}
        />
        <PageCard
          content={{
            icon: ShieldCheck,
            title: "Refurbished",
            description:
              "40-point inspected iPhones, Galaxies, and MacBooks backed by a 12-month warranty.",
            linkText: "Shop Refurbished",
            textColor: "text-emerald-400",
            bgColor: "bg-emerald-400/10",
            to: "/products?category=refurbished",
          }}
        />
      </section>
      <section>
        <div className="flex justify-between mb-8">
          <div>
            <p className="text-accent text-xs font-bold uppercase tracking-widest mb-1">
              Most Wanted Right Now
            </p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tighter text-header uppercase">
              Featured Products
            </h2>
          </div>
          <div className="flex items-center gap-2 bg-zinc-900/80 p-1.5 rounded-2xl border border-white/5 self-start">
            <button className="px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 bg-accent text-zinc-950">
              Trending Now
            </button>
            <button className="px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 text-main hover:text-header">
              Highest Rated
            </button>
            <button className="px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 text-main hover:text-header">
              Refurbished Steals
            </button>
          </div>
        </div>

        <ProductList products={products} layout={"grid"} />
      </section>
    </div>
  );
}

export default HomePage;
