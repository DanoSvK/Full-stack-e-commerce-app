import CategoriesSkeleton from "./CategoriesSkeleton";

function FiltersSidebarSkeleton() {
  return (
    <div className="glass-card w-[256px] space-y-8">
      <div className="bg-zinc-800 w-full h-6 animate-skeleton"></div>
      <div className="bg-zinc-800 w-3/4 h-6 animate-skeleton"></div>
      <CategoriesSkeleton />
      <div className="bg-zinc-800 w-full h-6 animate-skeleton"></div>
      <div className="bg-zinc-800 w-full h-6 animate-skeleton"></div>
    </div>
  );
}

export default FiltersSidebarSkeleton;
