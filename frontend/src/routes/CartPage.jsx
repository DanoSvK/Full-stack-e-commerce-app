import { Link, useNavigate } from "react-router-dom";
import EmptyCartPage from "../components/EmptyCartPage";
import { ArrowLeft, ArrowRight, Tag, Ticket, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useProducts } from "../api/useProducts";

function CartPage() {
  const { cartProducts } = useCart();
  const { products = [], isFetching } = useProducts();
  const navigate = useNavigate();

  // A map to join cartProducts IDs to products (to avoid using find() every time)
  const productMap = Object.fromEntries(products.map((p) => [p.id, p]));
  const cartWithProducts = cartProducts.map((item) => {
    const product = productMap[item.id];

    return {
      ...product,
      quantity: item.quantity,
    };
  });

  return (
    <main>
      {!cartWithProducts.length ? (
        <EmptyCartPage />
      ) : isFetching ? (
        <div>Loading...</div>
      ) : (
        <>
          <h1 className="text-4xl font-black tracking-tighter text-white uppercase mb-12">
            Shopping cart
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            <div className="lg:col-span-2 space-y-6">
              {/* CART ITEM */}
              {cartWithProducts.map((product) => (
                <section className="glass-card p-6 rounded-2xl flex items-center gap-6 group">
                  <div className="w-24 h-32 rounded-xl overflow-hidden bg-zinc-900 shrink-0">
                    <img src={product.imageUrl} alt="" />
                  </div>
                  <div className="flex flex-col grow space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-white font-bold hover:text-accent transition-colors">
                          {product.title}
                        </h3>
                        <div className="flex items-center text-zinc-500 text-xs mt-1">
                          {product.productCategories.map((category) => (
                            <p key={category.category.name}>
                              {category.category.name}
                            </p>
                          ))}
                          /
                          {product.productSubcategories.map((subcategory) => (
                            <p key={subcategory.subcategory.name}>
                              {subcategory.subcategory.name}
                            </p>
                          ))}
                        </div>
                      </div>
                      <button
                        type="button"
                        aria-label="Remove item from cart"
                        className="p-2 text-zinc-600 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                    <div className="flex justify-between items-center pt-4">
                      <div className="flex items-center bg-zinc-950 rounded-lg border border-white/5 p-1">
                        <button
                          type="button"
                          className="p-1.5 text-zinc-500 hover:text-white"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-white">
                          {product.quantity}
                        </span>
                        <button
                          type="button"
                          className="p-1.5 text-zinc-500 hover:text-white"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">
                          Total
                        </p>
                        <p className="text-white font-black text-lg">
                          {product.currency} {product.price * product.quantity}
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              ))}
              <Link
                to={navigate(-1)}
                className="inline-flex items-center gap-2 text-zinc-500 text-sm font-bold hover:text-white transition-colors pt-4"
              >
                <ArrowLeft size={16} />
                Continue Shopping
              </Link>
            </div>
            <section className="space-y-8">
              <section className="space-y-6 p-8 glass-card rounded-3xl">
                <h3 className="text-white font-bold text-xl uppercase tracking-tight">
                  Order summary
                </h3>
                <div className="text-sm space-y-4 pt-4">
                  <div className="flex items-center justify-between">
                    <p className="text-zinc-500">Subtotal</p>
                    <p className="text-white font-bold">$430.00</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-zinc-500">Estimated Taxes (23%)</p>
                    <p className="text-white font-bold">$50.00</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-zinc-500">Shipping</p>
                    <p className="text-emerald-500 font-bold">FREE</p>
                  </div>
                  <div className="border-t border-white/5 pt-4 flex justify-between items-baseline">
                    <p className="text-white font-bold  ">Grand Total</p>
                    <p className="text-3xl font-black text-accent">$464.00</p>
                  </div>
                </div>
                <div className="pt-6">
                  <Link className="btn-primary w-full flex items-center justify-center gap-2 group">
                    Checkout
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </section>
              <section className="glass-card p-6 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 text-white font-bold text-sm uppercase tracking-tight">
                  <Tag size={16} className="text-accent" />
                  <span>Promo code</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code..."
                    className="input-field grow text-sm"
                  />
                  <button
                    type="button"
                    className="bg-zinc-800 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-zinc-700 transition-colors"
                  >
                    Apply
                  </button>
                </div>
                <div className="flex items-center gap-2 p-3 bg-accent/5 border border-accent/20 rounded-xl">
                  <Ticket size={16} className="text-accent" />
                  <p className="text-zinc-400 text-[10px] leading-tight">
                    <span className="text-accent font-bold">DEMO10</span>{" "}
                    available for 10% off your first order.
                  </p>
                </div>
              </section>
            </section>
          </div>
        </>
      )}
    </main>
  );
}

export default CartPage;
