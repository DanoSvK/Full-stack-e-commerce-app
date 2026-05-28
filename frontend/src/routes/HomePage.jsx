import Hero from "../components/Hero";
import PageCard from "../components/PageCard";
import { Layers, TestTube2, ShoppingBag, Database, User } from "lucide-react";

function HomePage() {
  return (
    <>
      <Hero />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <PageCard
          content={{
            icon: TestTube2,
            title: "Experiments",
            description: "Test A/B variations and multivariate tests.",
            textColor: "text-blue-400",
            bgColor: "bg-blue-400/10",
            to: "/experiments",
          }}
        />
        <PageCard
          content={{
            icon: Layers,
            title: "Weblayers",
            description: "Manage overlays, banners, and dynamic content.",
            textColor: "text-purple-400",
            bgColor: "bg-purple-400/10",
            to: "/weblayers",
          }}
        />
        <PageCard
          content={{
            icon: ShoppingBag,
            title: "Products",
            description: "Explore the full demo catalog of items.",
            textColor: "text-accent",
            bgColor: "bg-accent/10",
            to: "/products",
          }}
        />
        <PageCard
          content={{
            icon: Database,
            title: "Catalogs",
            description: "Back-office catalog management and sync.",
            textColor: "text-emerald-400",
            bgColor: "bg-emerald-400/10",
            to: "/catalogs",
          }}
        />
        <PageCard
          content={{
            icon: User,
            title: "Account",
            description: "Manage customer profiles and properties.",
            textColor: "text-orange-400",
            bgColor: "bg-orange-400/10",
            to: "/account",
          }}
        />
      </div>
    </>
  );
}

export default HomePage;
