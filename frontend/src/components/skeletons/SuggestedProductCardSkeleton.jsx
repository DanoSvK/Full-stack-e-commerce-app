function SuggestedProductCardSkeleton() {
  return (
    <li className="flex items-center gap-3">
      <p className="bg-zinc-800 w-6 h-6 animate-skeleton"></p>
      <p className="bg-zinc-800 w-2/4 h-6 animate-skeleton"></p>
    </li>
  );
}

export default SuggestedProductCardSkeleton;
