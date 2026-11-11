import { Check, Copy } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

function PromoCard({ code, discount, description }) {
  const [isCopying, setIsCopying] = useState();

  async function handleClipboard() {
    try {
      await navigator.clipboard.writeText(code);
      toast.success(`Promo code ${code} copied to clipboard!`);
      setIsCopying(true);

      setTimeout(() => {
        setIsCopying(false);
      }, 3000);
    } catch (err) {
      console.error(err);
      toast.error("Failed to copy promo code.");
    }
  }

  return (
    <div className="glass-card p-6 rounded-3xl flex flex-col justify-between gap-6">
      <div className="space-y-2">
        <p className="text-accent font-bold text-xs uppercase tracking-widest">
          {discount}
        </p>
        <h3 className="text-header font-mono text-2xl font-black">{code}</h3>
        <p className="text-main text-xs leading-relaxed">{description}</p>
      </div>
      <button
        className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 border border-accent/30 text-accent text-xs font-bold hover:bg-accent hover:text-zinc-950 transition-colors cursor-pointer flex items-center justify-center gap-2"
        onClick={() => handleClipboard()}
      >
        {isCopying ? <Check size={20} /> : <Copy size={20} />}
        <span>{isCopying ? "Copied to Clipboard" : `Copy Code ${code}`}</span>
      </button>
    </div>
  );
}

export default PromoCard;
