import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

function EmptyCartPage() {
  return (
    <>
      <h1 className="text-3xl font-black tracking-tighter text-header uppercase mb-8">
        My Cart
      </h1>
      <div className="flex flex-col items-center gap-3 py-20 text-center bg-zinc-900/30 rounded-[40px] border border-dashed border-zinc-800">
        <div className="w-24 h-24 bg-zinc-900 text-zinc-700 rounded-full flex items-center justify-center">
          <ShoppingBag size={48} aria-hidden="true" />
        </div>
        <h2 className="text-header text-2xl tracking-tight font-bold mb-0">
          Your cart is empty
        </h2>
        <p className="text-main max-w-md">
          Looks like you haven't added anything to your cart yet. Start
          exploring our catalog!
        </p>
        <Link to="/products" className="btn-primary">
          Start shopping
        </Link>
      </div>
    </>
  );
}

export default EmptyCartPage;
