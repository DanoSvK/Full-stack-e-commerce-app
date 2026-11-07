import Hero from "../components/Hero";
import PageCard from "../components/PageCard";
import {
  Smartphone,
  Shirt,
  Zap,
  ShieldCheck,
  ArrowRight,
  Truck,
  RotateCcw,
  Ticket,
  Copy,
  Check,
} from "lucide-react";
import ProductList from "../features/products/ProductList";
import { useProducts } from "../features/products/useProducts";
import ProductListSkeleton from "../components/skeletons/ProductListSkeleton";
import LoaderError from "../ui/LoaderError";
import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

function HomePage() {
  const [featuredSelected, setfeaturedSelected] = useState("trending-now");
  const [isCopying, setIsCopying] = useState(false);

  const {
    data: productsData,
    isPending: isLoadingProducts,
    error: productsError,
  } = useProducts({ sort: featuredSelected, take: 6 });

  const products = productsData?.products ?? [];

  if (productsError) {
    return <LoaderError />;
  }

  async function handleClipboard() {
    try {
      await navigator.clipboard.writeText("best10");
      toast.success("Promo code BEST10 copied to clipboard!");
      setIsCopying(true);

      setTimeout(() => {
        setIsCopying(false);
      }, 3000);
    } catch (err) {
      console.error(err);
      toast.error("Failed to copy promo code.");
    }
  }

  return (
    <div className="space-y-24">
      <Hero />
      <section id="home-cards" className="scroll-mt-22">
        <div className="flex justify-between mb-8">
          <div>
            <p className="text-accent text-xs font-bold uppercase tracking-widest mb-1">
              Curated Departments
            </p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tighter text-header uppercase">
              Shop by Category
            </h2>
          </div>
          <Link
            to="/collections"
            className="text-accent text-sm font-bold flex items-center gap-1.5 hover:gap-2.5 transition-all cursor-pointer"
          >
            <span>View All Collections</span>
            <ArrowRight size={20} />
          </Link>
        </div>
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      </section>
      <section className="space-y-8">
        <div className="flex justify-between">
          <div>
            <p className="text-accent text-xs font-bold uppercase tracking-widest mb-1">
              Most Wanted Right Now
            </p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tighter text-header uppercase">
              Featured Products
            </h2>
          </div>
          <div className="flex items-center gap-2 bg-zinc-900/80 p-1.5 rounded-2xl border border-white/5 self-start">
            <button
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${featuredSelected === "trending-now" ? "bg-accent text-zinc-950" : "text-main hover:text-header"}`}
              onClick={() => setfeaturedSelected("trending-now")}
            >
              Trending Now
            </button>
            <button
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${featuredSelected === "highest-rated" ? "bg-accent text-zinc-950" : "text-main hover:text-header"}`}
              onClick={() => setfeaturedSelected("highest-rated")}
            >
              Highest Rated
            </button>
            <button
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${featuredSelected === "refurbished-steals" ? "bg-accent text-zinc-950" : "text-main hover:text-header"}`}
              onClick={() => setfeaturedSelected("refurbished-steals")}
            >
              Refurbished Steals
            </button>
          </div>
        </div>

        <section className="space-y-8">
          {isLoadingProducts ? (
            <ProductListSkeleton length={6} />
          ) : (
            <ProductList products={products} layout={"grid"} />
          )}

          <div className="flex justify-center">
            <Link to="/products" className="btn-secondary">
              Browse All 31 Products
            </Link>
          </div>
        </section>
      </section>

      <section className="glass-card rounded-3xl p-8 sm:p-12 border border-accent/20 relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-72 h-72 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
          <div className="space-y-3 max-w-xl">
            <p className="flex items-center gap-2 text-accent text-xs font-black uppercase tracking-widest">
              <Ticket size={14} />
              Member Exclusive Offer
            </p>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tighter text-header uppercase">
              {" "}
              Take 10% off your next order
            </h1>
            <p className="text-main text-sm leading-relaxed">
              Apply voucher code <strong className="text-header">BEST10</strong>{" "}
              (or <strong className="text-header">DEMO10</strong>) in your
              shopping cart for an instant 10% discount across all electronics,
              refurbished devices, and apparel.
            </p>
          </div>
          <div className="flex gap-4">
            <button
              className="uppercase flex items-center gap-3 bg-zinc-950 border border-accent/40 px-5 py-3 rounded-xl text-accent font-mono font-bold text-sm hover:bg-accent/10 transition-colors cursor-pointer"
              onClick={handleClipboard}
            >
              <span>Code: BEST10</span>
              {isCopying ? <Check size={16} /> : <Copy size={16} />}
            </button>
            <Link to="/deals" className="btn-primary">
              Shop All Deals
            </Link>
          </div>
        </div>
      </section>

      {/* TRUST & SHIPPING PERKS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-2xl flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
            <Truck size={22} className="text-accent shrink-0" />
          </div>{" "}
          <div>
            <h3 className="text-header font-bold text-base mb-1">
              Free Express Delivery
            </h3>
            <p className="text-main text-xs leading-relaxed">
              Complimentary next-day courier delivery on all orders with
              real-time parcel tracking.
            </p>
          </div>{" "}
        </div>
        <div className="glass-card p-6 rounded-2xl flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-400/10 flex items-center justify-center shrink-0">
            <ShieldCheck size={22} className="text-emerald-400 shrink-0" />
          </div>{" "}
          <div>
            <h3 className="text-header font-bold text-base mb-1">
              2-Year Official Warranty
            </h3>
            <p className="text-main text-xs leading-relaxed">
              Every new and certified refurbished product includes comprehensive
              hardware warranty protection.
            </p>
          </div>
        </div>
        <div className="glass-card p-6 rounded-2xl flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-400/10 flex items-center justify-center shrink-0">
            <RotateCcw size={22} className="text-blue-400 shrink-0" />
          </div>
          <div>
            <h3 className="text-header font-bold text-base mb-1">
              30-Day Hassle-Free Returns
            </h3>
            <p className="text-main text-xs leading-relaxed">
              Not the right fit or spec? Return or exchange any item within 30
              days with prepaid return labels
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
