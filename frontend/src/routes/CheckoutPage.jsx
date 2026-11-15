import {
  ArrowLeft,
  CreditCard,
  MapPin,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useProducts } from "../features/products/useProducts";
import CartPageSkeleton from "../components/skeletons/CartPageSkeleton";
import LoaderError from "../ui/LoaderError";

function CheckoutPage() {
  const {
    cartProducts,
    onAddOneProduct,
    onRemoveOneProduct,
    onRemoveProductFromCart,
  } = useCart();

  const {
    data: products,
    isPending: isFetchingProducts,
    error: productsError,
  } = useProducts();

  // Guard before doing anything with products
  if (isFetchingProducts) return <CartPageSkeleton />;
  if (productsError) return <LoaderError />;

  const productMap = Object.fromEntries(
    products.products.map((p) => [p.id, p]),
  );

  const cartWithProducts = cartProducts.map((item) => ({
    ...productMap[item.id],
    quantity: item.quantity,
  }));

  const totalPrice = cartWithProducts.reduce(
    (total, product) => total + product.price * product.quantity,
    0,
  );

  const VAT = 0.23;

  const taxPrice = totalPrice * VAT;
  const totalBeforeTax = totalPrice - taxPrice;

  return (
    <>
      <header>
        <Link
          to={"/cart"}
          className="inline-flex items-center gap-2 text-xs font-bold text-main hover:text-accent transition-colors mb-4"
        >
          <ArrowLeft size={16} />
          <span>Back to Shopping Cart</span>
        </Link>
        <h1 className="text-4xl font-black tracking-tighter text-header uppercase">
          Secure Checkout
        </h1>
      </header>

      <form className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        <div className="lg:col-span-2 space-y-6">
          <section className="glass-card p-8 rounded-3xl space-y-6">
            <header className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin size={20} color={"#ffde21"} />
                <h2 className="text-xl font-bold text-header">
                  1. Shipping Address
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-xs bg-zinc-900 border border-white/10 hover:border-accent/40 text-zinc-200 px-3 py-1.5 rounded-lg cursor-pointer">
                  Use Shipping
                </p>
                <p className="text-xs bg-zinc-900 border border-white/10 hover:border-accent/40 text-zinc-200 px-3 py-1.5 rounded-lg cursor-pointer">
                  Use Billing
                </p>
              </div>
            </header>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
              <div className="flex flex-col lg:col-span-1">
                <label
                  htmlFor="full-name"
                  className="text-main text-[10px] uppercase font-bold tracking-widest block mb-1"
                >
                  Full Name
                </label>
                <input
                  id="full-name"
                  name="fullName"
                  type="text"
                  className="input-field w-full text-sm"
                />
              </div>
              <div className="flex flex-col lg:col-span-1">
                <label
                  htmlFor="email"
                  className="text-main text-[10px] uppercase font-bold tracking-widest block mb-1"
                >
                  Email for Recipient & Tracking
                </label>
                <input
                  id="email"
                  name="email"
                  type="text"
                  className="input-field w-full text-sm"
                />
              </div>
              <div className="flex flex-col sm:col-span-2">
                <label
                  htmlFor="address"
                  className="text-main text-[10px] uppercase font-bold tracking-widest block mb-1"
                >
                  Street Address & Apartment
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  className="input-field w-full text-sm"
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="city"
                  className="text-main text-[10px] uppercase font-bold tracking-widest block mb-1"
                >
                  City
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  className="input-field w-full text-sm"
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="zip"
                  className="text-main text-[10px] uppercase font-bold tracking-widest block mb-1"
                >
                  Postal / Zip Code
                </label>
                <input
                  id="zip"
                  name="zip"
                  type="text"
                  className="input-field w-full text-sm"
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="country"
                  className="text-main text-[10px] uppercase font-bold tracking-widest block mb-1"
                >
                  Country
                </label>
                <input
                  id="country"
                  name="country"
                  type="text"
                  className="input-field w-full text-sm"
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="phone"
                  className="text-main text-[10px] uppercase font-bold tracking-widest block mb-1"
                >
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  className="input-field w-full text-sm"
                />
              </div>
            </div>
          </section>
          <section className="glass-card p-8 rounded-3xl space-y-5">
            <header className="flex items-center gap-2">
              <Truck size={22} color={"#ffde21"} />
              <h2 className="text-xl font-bold text-header">
                2. Delivery Method
              </h2>
            </header>
            <div className="flex flex-col gap-4 sm:flex-row">
              <button className="p-4 sm:flex-1 rounded-2xl border text-left transition-all cursor-pointer bg-zinc-900/50 border-white/5 hover:border-white/20">
                <div className="flex items-center justify-between">
                  <span className="text-header font-bold text-sm">
                    Express Next-Day Courier (Free)
                  </span>
                  <span className="text-emerald-400 text-xs font-bold uppercase">
                    Free
                  </span>
                </div>
                <p className="text-main text-xs">
                  Door-to-door insured delivery in 1-2 business days
                </p>
              </button>
              <button className="p-4 sm:flex-1 rounded-2xl border text-left transition-all cursor-pointer bg-zinc-900/50 border-white/5 hover:border-white/20">
                <div className="flex items-center justify-between">
                  <span className="text-header font-bold text-sm">
                    Parcel Locker Pickup (Free)
                  </span>
                  <span className="text-emerald-400 text-xs font-bold uppercase">
                    Free
                  </span>
                </div>
                <p className="text-main text-xs">
                  24/7 self-service pickup box with PIN code
                </p>
              </button>
            </div>
          </section>
          <section className="glass-card p-8 rounded-3xl space-y-6">
            <header className="flex items-center gap-2">
              <CreditCard size={22} color={"#ffde21"} />
              <h2 className="text-xl font-bold text-header">
                2. Delivery Method
              </h2>
            </header>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex-1 p-3.5 rounded-xl border text-xs font-bold transition-all cursor-pointer bg-accent text-zinc-950 border-accent">
                Credit/Debit Card
              </button>
              <button className="flex-1 p-3.5 rounded-xl border text-xs font-bold transition-all cursor-pointer bg-zinc-900 border-white/5 text-zinc-300 hover:bg-zinc-800">
                Apple Pay/GooglePa
              </button>
              <button className="flex-1 p-3.5 rounded-xl border text-xs font-bold transition-all cursor-pointer bg-zinc-900 border-white/5 text-zinc-300 hover:bg-zinc-800">
                Cash on Delivery
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 ">
              <div className="flex flex-col col-span-3">
                <label
                  htmlFor="card-number"
                  className="text-main text-[10px] uppercase font-bold tracking-widest block mb-1"
                >
                  Card Number
                </label>
                <input
                  id="card-number"
                  name="cardNumber"
                  type="text"
                  className="input-field w-full text-sm"
                />
              </div>
              <div className="flex flex-col col-span-2">
                <label
                  htmlFor="expiry-date"
                  className="text-main text-[10px] uppercase font-bold tracking-widest block mb-1"
                >
                  Expiration Date
                </label>
                <input
                  id="expiry-date"
                  name="expiryDate"
                  type="text"
                  className="input-field w-full text-sm"
                />
              </div>
              <div className="flex flex-col col-span-1">
                <label
                  htmlFor="cvc"
                  className="text-main text-[10px] uppercase font-bold tracking-widest block mb-1"
                >
                  CVC
                </label>
                <input
                  id="cvc"
                  name="cvc"
                  type="text"
                  className="input-field w-full text-sm"
                />
              </div>
            </div>
          </section>
        </div>

        <section className="glass-card p-8 rounded-3xl space-y-6 sticky top-28">
          <h3 className="text-header font-bold text-xl uppercase tracking-tight">
            Order summary
          </h3>
          <div></div>
          <div className="text-sm space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <p className="text-main">Subtotal (Excl. VAT) </p>
              <p className="text-header font-bold">{totalBeforeTax} €</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-main">Estimated Taxes (23%)</p>
              <p className="text-header font-bold">{taxPrice} €</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-main">Shipping</p>
              <p className="text-emerald-500 font-bold uppercase">Free</p>
            </div>
            <div className="border-t border-white/5 pt-4 flex justify-between items-baseline">
              <p className="text-header font-bold  ">Grand Total</p>
              <p className="text-3xl font-black text-accent">{totalPrice} €</p>
            </div>
          </div>

          <button className="btn-primary w-full flex items-center justify-center gap-2 group">
            <span>Place Order</span>
            <ShieldCheck size={16} />
          </button>
          <p className="text-main text-[11px] text-center">
            256-bit SSL encrypted checkout · 30-day return guarantee
          </p>
        </section>
      </form>
    </>
  );
}

export default CheckoutPage;
