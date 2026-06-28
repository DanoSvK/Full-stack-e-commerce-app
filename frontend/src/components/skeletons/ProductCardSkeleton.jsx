function ProductCardSkeleton() {
  return (
    <div className="relative glass-card rounded-2xl overflow-hidden">
      <div className="absolute top-4 left-4 bg-zinc-900/80 w-1/4 h-4 z-10 space-x-2 animate-skeleton"></div>
      <div className="overflow-hidden aspect-square bg-zinc-800 rounded-lg"></div>
      <div className="space-y-6 p-5">
        <div className="space-y-1">
          <p className="bg-zinc-800 w-2/4 h-6 animate-skeleton"></p>
          <p className="bg-zinc-800 w-1/3 h-4 animate-skeleton"></p>
        </div>
        <div>
          <div className="space-y-1">
            <p className="bg-zinc-800 w-1/3 h-4 animate-skeleton"></p>
            <p className="bg-zinc-800 w-2/4 h-6 animate-skeleton"></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCardSkeleton;
