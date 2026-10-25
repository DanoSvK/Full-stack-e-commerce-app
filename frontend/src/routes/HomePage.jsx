import Hero from "../ui/Hero";
import PageCard from "../components/PageCard";
import { Smartphone, Shirt, Zap, ShieldCheck } from "lucide-react";

function HomePage() {
  return (
    <>
      <Hero />
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        id="home-cards"
      >
        <PageCard
          content={{
            icon: Smartphone,
            title: "Electronics",
            description:
              "Flagship titanium smartphones and M-series OLED ultrabooks engineered for pro workflows.",
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
            textColor: "text-emerald-400",
            bgColor: "bg-emerald-400/10",
            to: "/products?category=refurbished",
          }}
        />
      </div>
    </>
  );
}

export default HomePage;
