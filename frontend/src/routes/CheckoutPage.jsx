import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  CreditCard,
  MapPin,
  ShieldCheck,
  Truck,
} from "lucide-react";

import { useCart } from "../context/CartContext";
import { useProducts } from "../features/products/useProducts";
import { getEffectivePrice } from "../utils/getEffectivePrice";
import CartPageSkeleton from "../components/skeletons/CartPageSkeleton";
import LoaderError from "../ui/LoaderError";
import { useState } from "react";
import AddressForm from "../components/AddressForm";
import Checkbox from "../ui/Checkbox";

function CheckoutPage() {
  const [deliveryMethod, setDeliveryMethod] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const [sameAsShipping, setSameAsShipping] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      shipping: {},
      billing: {},
    },
  });

  const navigate = useNavigate();

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
  } = useProducts({ shouldPaginate: false });

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
    (total, product) => total + getEffectivePrice(product) * product.quantity,
    0,
  );

  const VAT = 0.23;

  const taxPrice = totalPrice * VAT;
  const totalBeforeTax = totalPrice - taxPrice;

  const onSubmit = (data) => console.log("VALID DATA:", data);

  const onInvalid = (errors) => console.log("INVALID:", errors);
  return (
    <>
      <header className="mb-6">
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

      <form
        className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start"
        onSubmit={handleSubmit(onSubmit, onInvalid)}
      >
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

            {/* SHIPPING FORM */}
            <AddressForm
              register={register}
              errors={errors}
              prefix={"shipping"}
            />

            <Checkbox
              checked={sameAsShipping}
              setChecked={setSameAsShipping}
              label={"Billing address is the same as shipping"}
              id={"billing"}
            />

            {/* BILLING FORM */}
            {!sameAsShipping && (
              <AddressForm
                register={register}
                errors={errors}
                prefix={"billing"}
              />
            )}
          </section>

          {/* DELIVERY METHOD */}
          <section className="glass-card p-8 rounded-3xl space-y-5">
            <header className="flex items-center gap-2">
              <Truck size={22} color={"#ffde21"} />
              <h2 className="text-xl font-bold text-header">
                2. Delivery Method
              </h2>
            </header>
            <div className="flex flex-col gap-4 sm:flex-row">
              <button
                type="button"
                className={`p-4 sm:flex-1 rounded-2xl border text-left transition-all cursor-pointer ${deliveryMethod === "courier" ? "bg-accent/10 border-accent" : "bg-zinc-900/50 border-white/5 hover:border-white/20"}`}
                onClick={() => setDeliveryMethod("courier")}
              >
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
              <button
                type="button"
                className={`p-4 sm:flex-1 rounded-2xl border text-left transition-all cursor-pointer ${deliveryMethod === "locker" ? "bg-accent/10 border-accent" : "bg-zinc-900/50 border-white/5 hover:border-white/20"}`}
                onClick={() => setDeliveryMethod("locker")}
              >
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

          {/* PAYMENT METHOD */}
          <section className="glass-card p-8 rounded-3xl space-y-6">
            <header className="flex items-center gap-2">
              <CreditCard size={22} color={"#ffde21"} />
              <h2 className="text-xl font-bold text-header">
                3. Payment Method
              </h2>
            </header>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                className={`flex-1 p-3.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${paymentMethod === "card" ? "bg-accent text-zinc-950 border-accent" : "bg-zinc-900 border-white/5 text-zinc-300 hover:bg-zinc-800"}`}
                onClick={() => setPaymentMethod("card")}
              >
                Credit / Debit Card
              </button>
              <button
                type="button"
                className={`flex-1 p-3.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${paymentMethod === "apple" ? "bg-accent text-zinc-950 border-accent" : "bg-zinc-900 border-white/5 text-zinc-300 hover:bg-zinc-800"}`}
                onClick={() => setPaymentMethod("apple")}
              >
                Apple Pay
              </button>
              <button
                type="button"
                className={`flex-1 p-3.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${paymentMethod === "google" ? "bg-accent text-zinc-950 border-accent" : "bg-zinc-900 border-white/5 text-zinc-300 hover:bg-zinc-800"}`}
                onClick={() => setPaymentMethod("google")}
              >
                Google Pay
              </button>
              <button
                type="button"
                className={`flex-1 p-3.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${paymentMethod === "cash" ? "bg-accent text-zinc-950 border-accent" : "bg-zinc-900 border-white/5 text-zinc-300 hover:bg-zinc-800"}`}
                onClick={() => setPaymentMethod("cash")}
              >
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
          <div>
            <ul>
              {cartWithProducts.map((p) => {
                return (
                  <li className="flex items-center justify-between gap-3 text-xs border-b border-white/5 pb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={p.imageUrl}
                        alt=""
                        className="w-11 h-11 rounded-lg object-cover bg-zinc-900 shrink-0 cursor-pointer hover:opacity-85"
                        onClick={() => navigate(`/product/${p.id}`)}
                      />
                      <div className="min-w-0">
                        <p
                          className="text-header font-bold truncate cursor-pointer hover:text-accent"
                          onClick={() => navigate(`/product/${p.id}`)}
                        >
                          {p.title}
                        </p>
                        <p className="text-main">
                          {`${p.quantity}`} · Black Titanium · 128GB
                        </p>
                      </div>
                    </div>
                    <p className="text-header font-bold tabular-nums shrink-0">
                      {getEffectivePrice(p)} €
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="text-sm space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <p className="text-main">Subtotal (Excl. VAT) </p>
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
              <p className="text-emerald-500 font-bold uppercase">Free</p>
            </div>
            <div className="border-t border-white/5 pt-4 flex justify-between items-baseline">
              <p className="text-header font-bold  ">Grand Total</p>
              <p className="text-3xl font-black text-accent">
                {totalPrice.toFixed(2)} €
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary w-full flex items-center justify-center gap-2 group"
          >
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
