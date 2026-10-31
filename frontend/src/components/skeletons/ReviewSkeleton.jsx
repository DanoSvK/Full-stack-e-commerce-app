function ReviewSkeleton() {
  return (
    <div className="p-6 glass-card rounded-2xl space-y-3">
      <div className="w-80 h-5 bg-zinc-900/80 animate-skeleton"></div>
      <div className="w-120 h-7.5 bg-zinc-900/80 animate-skeleton"></div>
      <div className="w-80 h-4 bg-zinc-900/80 animate-skeleton"></div>
    </div>
  );
}

export default ReviewSkeleton;
