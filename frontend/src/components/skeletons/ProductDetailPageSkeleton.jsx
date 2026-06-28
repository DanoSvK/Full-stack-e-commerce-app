function ProductDetailPageSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-16 max-w-5xl mx-auto">
      {/* Left col — image top, thumbnails bottom */}
      <div className="flex flex-col gap-4">
        <div className="aspect-4/5 rounded-3xl overflow-hidden bg-zinc-900 border border-white/5 animate-skeleton" />
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-xl overflow-hidden bg-zinc-700/30 border border-white/5 animate-skeleton"
            />
          ))}
        </div>
      </div>

      {/* Right col */}
      <div className="flex flex-col gap-10">
        <div className="bg-zinc-700/30 h-[3%] w-[35%] animate-skeleton" />
        <div className="bg-zinc-700/30 h-[6%] w-[50%] animate-skeleton" />
        <div className="bg-zinc-700/30 h-[6%] w-[40%] animate-skeleton" />
        <div className="bg-zinc-700/30 h-[4%] w-[35%] animate-skeleton" />
        <div className="bg-zinc-700/30 h-[4%] w-[37%] animate-skeleton" />
        <div className="bg-zinc-700/30 h-[4%] w-[36%] animate-skeleton" />
        <div className="bg-zinc-700/30 h-[5%] w-[55%] animate-skeleton" />
        <div className="bg-zinc-700/30 h-[5%] w-[55%] animate-skeleton" />
      </div>
    </div>
  );
}

export default ProductDetailPageSkeleton;
