import { Sparkles, Tag, Ticket } from "lucide-react";
import PromoCard from "../components/PromoCard";
import ProductList from "../features/products/ProductList";
import { useProducts } from "../features/products/useProducts";

function DealsPage() {
  const VOUCHERS = [
    {
      code: "BEST10",
      discount: "10% OFF SITEWIDE",
      description:
        "Valid on all flagship smartphones, laptops, and streetwear apparel with no minimum spend.",
    },
    {
      code: "DEMO10",
      discount: "10% WELCOME VOUCHER",
      description:
        "Classic BESTshop welcome discount code redeemable directly in your shopping cart.",
    },
    {
      code: "VIP20",
      discount: "20% PLATINUM VIP",
      description:
        "Exclusive Platinum Member savings on multi-item orders and seasonal drops.",
    },
  ];

  const {
    data: productsData,
    isPending: isLoadingProducts,
    isPlaceholderData,
    error: productsError,
  } = useProducts({ discountPrice: "true", limit: 9 });

  const products = productsData?.products ?? [];

  return (
    <main className="space-y-16">
      <header className="max-w-3xl space-y-4">
        <div className="flex items-center gap-2 text-accent text-xs font-black uppercase tracking-widest">
          <Sparkles size={20} />
          <span>Special Offers & Active Vouchers</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-header uppercase leading-none">
          Deals & Seasonal Drops
        </h1>
        <p className="text-main text-base sm:text-lg leading-relaxed">
          Instant markdowns on flagship electronics, certified refurbished
          devices, and heavyweight streetwear essentials—plus stackable member
          vouchers.
        </p>
      </header>
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-accent text-sm font-bold uppercase tracking-wider">
          <Ticket size={20} />
          <span className="text-header">Click to Copy Cart Promo Codes</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {VOUCHERS.map((voucher) => {
            return (
              <PromoCard
                code={voucher.code}
                discount={voucher.discount}
                description={voucher.description}
              />
            );
          })}
        </div>
      </section>
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-accent text-sm font-bold uppercase tracking-wider">
          <Tag size={20} />
          <span className="text-header">Featured Price Drops</span>
        </div>
        <ProductList products={products} />
      </section>
    </main>
  );
}

export default DealsPage;
