import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link to="/" className="flex gap-2 items-center group">
      <div className="bg-yellow-300 w-8 h-8 flex items-center justify-center rounded-sm group-hover:rotate-12 transition-transform">
        <span className="text-zinc-950 font-black text-xl">B</span>
      </div>
      <span className="text-white font-black tracking-tighter text-xl">
        BESTshop
      </span>
    </Link>
  );
}
