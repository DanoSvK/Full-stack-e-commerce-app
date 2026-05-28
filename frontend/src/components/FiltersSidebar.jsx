import { Search, AlertCircle } from "lucide-react";
import CategoryButton from "./CategoryButton";
import SubcategoryButton from "./SubcategoryButton";

function FiltersSidebar({
  onUpdateFilter,
  filters,
  categories,
  subcategories,
}) {
  return (
    <section>
      <h3 className="text-white font-black text-xl tracking-tighter uppercase mb-8">
        FILTERS
      </h3>
      <div>
        {/* SEARCH */}
        <div className="mb-8">
          <label
            htmlFor="search"
            className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest"
          >
            Search
          </label>
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 z-10"
              aria-hidden="true"
            />
            <input
              type="text"
              id="search"
              placeholder="Product name..."
              className="input-field w-full pl-10! text-sm relative"
              onInput={(e) => {
                onUpdateFilter("search", e.target.value);
              }}
            />
          </div>
        </div>

        {/* PRODUCT ID */}
        <div className="mb-8">
          <label
            htmlFor="product-id"
            className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest"
          >
            Product ID
          </label>
          <div className="relative">
            <AlertCircle
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 z-10"
            />
            <input
              type="text"
              id="product-id"
              placeholder="e.g. prod-1"
              className="input-field w-full pl-10! text-sm relative"
              onInput={(e) => {
                onUpdateFilter("productId", e.target.value);
              }}
            />
          </div>
        </div>

        {/* CATEGORY */}
        <div className="mb-8">
          <label
            htmlFor="category"
            className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest"
          >
            Category
          </label>
          <div className="flex flex-col items-start">
            {categories.map((category) => (
              <CategoryButton
                key={category}
                label={category.charAt(0).toUpperCase() + category.slice(1)}
                active={filters.category === category}
                onUpdateFilter={onUpdateFilter}
              />
            ))}
          </div>
        </div>

        {/* SUBCATEGORY */}
        {filters.category !== "all" && (
          <div className="mb-8">
            <label className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">
              Subcategory
            </label>
            <div className="flex flex-col">
              {subcategories.map((subcategory) => (
                <SubcategoryButton
                  key={subcategory}
                  label={
                    subcategory.charAt(0).toUpperCase() + subcategory.slice(1)
                  }
                  active={filters.subcategory === subcategory}
                  onUpdateFilter={onUpdateFilter}
                />
              ))}
            </div>
          </div>
        )}

        {/* PRICE RANGE */}
        <div className="mb-8">
          <label className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">
            Price Range
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={filters.priceRange.min}
              className="input-field flex-1 min-w-0 w-0 text-sm text-white"
              onChange={(e) => {
                onUpdateFilter("priceRange", {
                  min: e.target.value,
                  max: filters.priceRange.max,
                });
              }}
            />
            <span>-</span>
            <input
              type="number"
              value={filters.priceRange.max}
              className="input-field flex-1 min-w-0 w-0 text-sm text-white"
              onChange={(e) => {
                onUpdateFilter("priceRange", {
                  min: filters.priceRange.min,
                  max: e.target.value,
                });
              }}
            />
          </div>
        </div>

        {/* STOCK LEVEL */}
        <div className="flex flex-col mb-8">
          <label
            htmlFor="stock"
            className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest"
          >
            Stock level
          </label>
          <select
            id="stock"
            className="input-field text-sm text-white"
            onChange={(e) => {
              onUpdateFilter("stockLevel", e.target.value);
            }}
          >
            <option value="all">All items</option>
            <option value="in-stock">In Stock</option>
            <option value="low-stock">Low Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>
        </div>
      </div>
    </section>
  );
}

export default FiltersSidebar;
