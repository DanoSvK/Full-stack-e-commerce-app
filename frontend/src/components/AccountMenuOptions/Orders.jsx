import { Package } from "lucide-react";
import { Link } from "react-router-dom";

function Orders() {
  return (
    <>
      <h1 className="text-3xl font-black tracking-tighter text-white uppercase mb-8">
        Order History
      </h1>
      <div className="glass-card p-6 rounded-2xl flex flex-col md:flex-row justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-500">
            <Package size={32} aria-hidden="true" />
          </div>
          <article>
            <h3 className="text-white font-bold">Order #DEMO-823911</h3>
            <p className="text-zinc-500 text-xs">
              Placed on <span>March 14, 2026</span>
            </p>
            <p className="flex items-center gap-2 pt-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-emerald-500 text-[10px] uppercase font-bold tracking-widest">
                Delivered
              </span>
            </p>
          </article>
        </div>
        <div className="flex justify-between md:flex-col items-end">
          <p className="text-white font-black text-xl">$129.00</p>
          <Link className="text-accent text-xs font-bold hover:underline">
            View Details
          </Link>
        </div>
      </div>
    </>
  );
}

export default Orders;
