import { Search, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CategoryButton from "./CategoryButton";
import SubcategoryButton from "./SubcategoryButton";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import { useSuggestedProducts } from "./useSuggestedProducts";
import SuggestedProductCard from "./SuggestedProductCard";
import SuggestedProductCardSkeleton from "../../components/skeletons/SuggestedProductCardSkeleton";
import { useCategories } from "../../features/products/useCategories";
import CategoriesSkeleton from "../../components/skeletons/CategoriesSkeleton";
import { usePrices } from "../products/usePrices";

function FiltersSidebar({ onUpdateFilter, filters }) {
  const [suggestedQuery, setSuggestedQuery] = useState("");
  const debouncedQuery = useDebounce(suggestedQuery, 300);

  const {
    data: suggestedProducts,
    isPending: isFetchingSuggestedProducts,
    error: suggestedProductsError,
  } = useSuggestedProducts(debouncedQuery);

  const suggestions = suggestedProducts?.data?.products ?? [];

  const {
    data: pricesData,
    isPending: isFetchingPrices,
    error: pricesError,
  } = usePrices();

  const fetchedPriceRange = pricesData?.prices ?? { min: 0, max: 1000 };

  useEffect(() => {
    if (pricesData?.prices) {
      onUpdateFilter("priceRange", pricesData.prices);
    }
  }, [pricesData]);

  const {
    data: categoriesData,
    isPending: isFetchingCategories,
    error: categoriesError,
  } = useCategories();

  const fetchedCategories = categoriesData?.categories ?? [];

  // DERIVE CATEGORIES FROM PRODUCTS FOR FILTER
  const categories = [
    "all",
    ...new Set(fetchedCategories.map((category) => category.slug)),
  ];

  // DERIVE SUBCATEGORIES FROM CATEGORIES FOR FILTER
  const subcategories = filters.category.includes("all")
    ? []
    : [
        "all",
        ...new Set(
          fetchedCategories.flatMap((category) =>
            category.subcategories.map(
              (subcategory) => subcategory.subcategory.slug,
            ),
          ),
        ),
      ];

  const navigate = useNavigate();
  const [isSuggestionsModal, setIsSuggestionsModal] = useState(false);

  // Local input value states (to work with onBlur and use value property to update inputs dynamically)
  const [localMin, setLocalMin] = useState(fetchedPriceRange.min);
  const [localMax, setLocalMax] = useState(fetchedPriceRange.max);

  // Memory of previous value - Local tracking states to safely sync dynamic values from the API during render
  const [prevMin, setPrevMin] = useState(filters.priceRange?.min);
  const [prevMax, setPrevMax] = useState(filters.priceRange?.max);

  // Sync inputs dynamically when dynamic price data is fetched/changed via parent
  if (filters.priceRange?.min !== prevMin) {
    setLocalMin(filters.priceRange.min); // Update the input box with the new API data
    setPrevMin(filters.priceRange.min); // Update the memory so this block doesn't loop
  }

  if (filters.priceRange?.max !== prevMax) {
    setLocalMax(filters.priceRange.max);
    setPrevMax(filters.priceRange.max);
  }

  const [_, setSearchParams] = useSearchParams("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (searchQuery) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);

      if (searchQuery) {
        next.set("title", searchQuery);
      } else {
        next.delete("title");
      }

      next.delete("category");
      filters.category = "all";
      next.delete("subcategory");
      next.delete("page");
      setIsSuggestionsModal(false);

      return next;
    });
  };

  const handleCategory = (categoryQuery) => {
    onUpdateFilter("stockLevel", "all");

    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);

      if (categoryQuery === "all") {
        next.delete("category");
      } else {
        next.set("category", categoryQuery);
      }

      next.delete("subcategory");
      next.delete("page");
      const stockTypes = ["stock", "stock_gt", "stock_lte", "stock_e"];
      stockTypes.forEach((stockType) => next.delete(stockType));

      return next;
    });
  };

  const handleSubcategory = (subcategoryQuery) => {
    onUpdateFilter("stockLevel", "all");

    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);

      if (subcategoryQuery === "all") {
        next.delete("subcategory");
      } else {
        next.set("subcategory", subcategoryQuery);
      }

      const stockTypes = ["stock", "stock_gt", "stock_lte", "stock_e"];
      stockTypes.forEach((stockType) => next.delete(stockType));
      next.delete("page");

      return next;
    });
  };

  function handlePrice(type, value) {
    // Treat empty string natively to allow full backspaces
    if (value === "") {
      onUpdateFilter("priceRange", {
        ...filters.priceRange,
        [type]: "",
      });

      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.delete(type === "min" ? "price_gte" : "price_lte");
        return next;
      });

      return;
    }

    let finalPrice = Number(value);

    // Apply boundary checks accurately before changing any states
    if (type === "min" && finalPrice < pricesData.prices.min) {
      finalPrice = pricesData.prices.min;
      setLocalMin(pricesData.prices.min); // Force input box to snap to validated minimum
    }
    if (type === "max" && finalPrice > pricesData.prices.max) {
      finalPrice = pricesData.prices.max;
      setLocalMax(pricesData.prices.max); // Force input box to snap to validated maximum
    }

    // Single source-of-truth state dispatch
    const updatedPriceRange = {
      ...filters.priceRange,
      [type]: finalPrice,
    };

    onUpdateFilter("priceRange", updatedPriceRange);

    // Calculate dynamic parameters cleanly for the search tracking query string
    const targetMinPrice = type === "min" ? finalPrice : filters.priceRange.min;
    const targetMaxPrice = type === "max" ? finalPrice : filters.priceRange.max;

    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (targetMinPrice !== "") next.set("price_gte", targetMinPrice);
      if (targetMaxPrice !== "") next.set("price_lte", targetMaxPrice);
      return next;
    });
  }

  function handleStock(value) {
    onUpdateFilter("stockLevel", value);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);

      const stockTypes = ["stock", "stock_gt", "stock_lte", "stock_e"];
      stockTypes.forEach((stockType) => next.delete(stockType));
      next.delete("page");

      switch (value) {
        case "all":
          next.delete("stock");
          break;
        case "in-stock":
          next.set("stock_gt", "10");
          break;
        case "low-stock":
          next.set("stock_lte", "10");
          break;
        case "out-of-stock":
          next.set("stock_e", "0");
          break;
        default:
          next.delete("stock");
      }

      return next;
    });
  }

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
            <button
              type="submit"
              className="cursor-pointer"
              aria-label="search"
              onClick={() => handleSearch(searchQuery)}
            >
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 z-10"
                aria-hidden="true"
              />
            </button>
            <input
              type="text"
              autoComplete="off"
              id="search"
              placeholder="Product name..."
              className="input-field w-full pl-10! text-sm relative"
              onInput={(e) => {
                setSearchQuery(e.target.value);
                setSuggestedQuery(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch(searchQuery);
              }}
              onFocus={() => setIsSuggestionsModal(true)}
              onBlur={() => setIsSuggestionsModal(false)}
              onMouseDown={() => navigate()}
            />
            {isSuggestionsModal && (
              <div className="absolute bg-zinc-900/60 backdrop-blur-lg border border-white/5 rounded-lg w-full z-20 p-3 space-y-1">
                {!searchQuery ? (
                  <p className="text-sm text-zinc-500">Start typing...</p>
                ) : isFetchingSuggestedProducts ? (
                  <SuggestedProductCardSkeleton />
                ) : suggestedProductsError ? (
                  <p className="text-red-500">Error searching products</p>
                ) : !suggestions.length ? (
                  <p className="text-sm text-zinc-500">No products found.</p>
                ) : (
                  <ul className="space-y-3">
                    {suggestions.map((product) => (
                      <SuggestedProductCard
                        product={product}
                        key={product.id}
                      />
                    ))}
                  </ul>
                )}
              </div>
            )}
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
              onInput={(e) => onUpdateFilter("productId", e.target.value)}
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
          {isFetchingCategories ? (
            <CategoriesSkeleton />
          ) : categoriesError ? (
            <p className="text-red-500">Could not load categories</p>
          ) : (
            <div className="flex flex-col items-start">
              {categories.map((category) => (
                <CategoryButton
                  key={category}
                  label={category.charAt(0).toUpperCase() + category.slice(1)}
                  active={filters.category === category}
                  onUpdateFilter={onUpdateFilter}
                  onCategory={handleCategory}
                />
              ))}
            </div>
          )}
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
                  onSubcategory={handleSubcategory}
                />
              ))}
            </div>
          </div>
        )}

        {/* PRICE RANGE */}
        {isFetchingPrices ? (
          <div className="mb-8 text-zinc-500 text-sm">Loading prices...</div>
        ) : pricesError ? (
          <p className="text-red-500">Could not load prices</p>
        ) : (
          <div className="mb-8">
            <label className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">
              Price Range
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={localMin}
                onChange={(e) => setLocalMin(e.target.value)}
                className="input-field flex-1 min-w-0 w-0 text-sm text-white"
                onBlur={(e) => handlePrice("min", e.target.value)}
              />
              <span>-</span>
              <input
                type="number"
                value={localMax}
                onChange={(e) => setLocalMax(e.target.value)}
                className="input-field flex-1 min-w-0 w-0 text-sm text-white"
                onBlur={(e) => handlePrice("max", e.target.value)}
              />
            </div>
          </div>
        )}

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
            value={filters.stockLevel}
            className="input-field text-sm text-white"
            onChange={(e) => {
              handleStock(e.target.value);
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
