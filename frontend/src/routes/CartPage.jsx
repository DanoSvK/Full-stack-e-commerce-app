import { Link, useNavigate } from "react-router-dom";
import EmptyCartPage from "../components/EmptyCartPage";
import { ArrowLeft, ArrowRight, Tag, Ticket, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import CartPageSkeleton from "../components/skeletons/CartPageSkeleton";
import { getEffectivePrice } from "../utils/getEffectivePrice";
import { useProductsById } from "../features/products/useProductsById";
import LoaderError from "../ui/LoaderError";

function CartPage() {
  const {
    cartProducts,
    onAddOneProduct,
    onRemoveOneProduct,
    onRemoveProductFromCart,
  } = useCart();

  const prods = cartProducts.map((p) => {
    return p.id;
  });
  const navigate = useNavigate();

  // Fetch products (using separate API accepting multiple IDs) based on IDs of cartProducts context
  const {
    data: populatedCartProducts = [],
    isPending: isFetchingProducts,
    error: productsError,
  } = useProductsById(prods);

  if (prods.length === 0) return <EmptyCartPage />;
  if (isFetchingProducts) return <CartPageSkeleton />;
  if (productsError) return <LoaderError />;

  // Populate each product with quantity from cart context
  // Used to track quantity and correct prices
  const cartWithProducts = populatedCartProducts.map((product) => {
    const cartItem = cartProducts.find((item) => item.id === product.id);

    return {
      ...product,
      quantity: cartItem?.quantity,
    };
  });

  const totalPrice = cartWithProducts.reduce(
    (total, product) => total + getEffectivePrice(product) * product.quantity,
    0,
  );

  const VAT = 0.23;
  const taxPrice = totalPrice * VAT;
  const totalBeforeTax = totalPrice - taxPrice;
  return (
    <>
      <h1 className="text-4xl font-black tracking-tighter text-header uppercase mb-12">
        Shopping cart
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        <div className="lg:col-span-2 space-y-6">
          {/* CART ITEM */}
          {cartWithProducts.map((product) => (
            <section
              className="glass-card p-6 rounded-2xl flex items-center gap-6 group"
              key={product.id}
            >
              <div className="w-24 h-32 rounded-xl overflow-hidden bg-zinc-900 shrink-0">
                <img src={product.imageUrl} alt={product.title} />
              </div>
              <div className="flex flex-col grow space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-header font-bold hover:text-accent transition-colors">
                      {product.title}
                    </h3>
                    <div className="flex items-center text-main text-xs mt-1">
                      {product.subcategory.categories.map((category) => (
                        <p key={category.category.name}>
                          {category.category.name}
                        </p>
                      ))}
                      /<p>{product.subcategory.name}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    aria-label="Remove item from cart"
                    className="p-2 text-zinc-600 hover:text-red-500 transition-colors cursor-pointer"
                    onClick={() => onRemoveProductFromCart(product.id)}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
                <div className="flex justify-between items-center pt-4">
                  <div className="flex items-center bg-zinc-950 rounded-lg border border-white/5 p-1">
                    <button
                      type="button"
                      className="p-1.5 text-main hover:text-header"
                      onClick={() => onRemoveOneProduct(product.id)}
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-sm font-bold text-header">
                      {product.quantity}
                    </span>
                    <button
                      type="button"
                      className="p-1.5 text-main hover:text-header"
                      onClick={() => onAddOneProduct(product.id)}
                    >
                      +
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-main text-[10px] uppercase font-bold tracking-widest">
                      Total
                    </p>
                    <p className="text-header font-black text-lg">
                      {(getEffectivePrice(product) * product.quantity).toFixed(
                        2,
                      )}{" "}
                      €
                    </p>
                  </div>
                </div>
              </div>
            </section>
          ))}
          <button
            type="button"
            className="btn-secondary inline-flex items-center justify-center gap-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={16} />
            Go back
          </button>
        </div>
        <section className="space-y-8">
          <section className="space-y-6 p-8 glass-card rounded-3xl">
            <h3 className="text-header font-bold text-xl uppercase tracking-tight">
              Order summary
            </h3>
            <div className="text-sm space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <p className="text-main">Subtotal</p>
                <p className="text-header font-bold">
                  {totalBeforeTax.toFixed(2)} €
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-main">Estimated Taxes (23%)</p>
                <p className="text-header font-bold">{taxPrice.toFixed(2)} €</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-main">Shipping</p>
                <p className="text-emerald-500 font-bold">FREE</p>
              </div>
              <div className="border-t border-white/5 pt-4 flex justify-between items-baseline">
                <p className="text-header font-bold  ">Grand Total</p>
                <p className="text-3xl font-black text-accent">
                  {totalPrice.toFixed(2)} €
                </p>
              </div>
            </div>
            <div className="pt-6">
              <Link
                to="/checkout"
                className="btn-primary w-full flex items-center justify-center gap-2 group"
              >
                Checkout
                <ArrowRight size={16} />
              </Link>
            </div>
          </section>
          <section className="glass-card p-6 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 text-header font-bold text-sm uppercase tracking-tight">
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
                className="bg-zinc-800 text-header px-4 py-2 rounded-lg text-xs font-bold hover:bg-zinc-700 transition-colors cursor-pointer"
              >
                Apply
              </button>
            </div>
            <div className="flex items-center gap-2 p-3 bg-accent/5 border border-accent/20 rounded-xl">
              <Ticket size={16} className="text-accent" />
              <p className="text-main text-[10px] leading-tight">
                <span className="text-accent font-bold">DEMO10</span> available
                for 10% off your first order.
              </p>
            </div>
          </section>
        </section>
      </div>
    </>
  );
}

export default CartPage;
