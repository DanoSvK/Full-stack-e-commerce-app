function CartPageSkeleton() {
  return (
    <div className="space-y-2">
      <h1 className="text-4xl font-black tracking-tighter text-white uppercase mb-12">
        Shopping cart
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        <p className="col-span-2 bg-zinc-800 h-46 animate-skeleton rounded-xl"></p>
        <p className="col-start-3 col-span-1 bg-zinc-800 h-86 animate-skeleton rounded-xl"></p>
        <p className="col-start-3 col-span-1 bg-zinc-800 h-36 animate-skeleton rounded-xl"></p>
      </div>
    </div>
  );
}

export default CartPageSkeleton;
