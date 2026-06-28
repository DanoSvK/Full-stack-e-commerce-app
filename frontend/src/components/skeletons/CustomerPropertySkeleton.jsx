function CustomerPropertySkeleton() {
  return (
    <div className="glass-card space-y-3 p-6 max-w-xs w-full rounded-xl">
      <p className="bg-zinc-800 w-[40%] h-3 animate-skeleton"></p>
      <p className="bg-zinc-800 w-[70%] h-5 animate-skeleton"></p>
    </div>
  );
}

export default CustomerPropertySkeleton;
