import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

function EmptyCartPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center space-y-8">
      <div className="w-24 h-24 bg-zinc-900 text-zinc-700 rounded-full flex items-center justify-center">
        <ShoppingBag size={48} aria-hidden="true" />
      </div>
      <h1 className="uppercase text-3xl font-black tracking-tighter text-white mb-2">
        Your cart is empty
      </h1>
      <p className="text-zinc-500 max-w-xs">
        Looks like you haven't added anything to your cart yet. Start exploring
        our catalog!
      </p>
      <Link to="/products" className="btn-primary">
        Start shopping
      </Link>
    </div>
  );
}

export default EmptyCartPage;
