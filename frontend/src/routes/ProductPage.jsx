import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { usePrices } from "../features/products/usePrices";

import { Filter, LayoutGrid, List, ArrowUpDown } from "lucide-react";

import ProductList from "../features/products/ProductList";
import FiltersSidebar from "../features/products/FiltersSidebar";
import Pagination from "../ui/Pagination";

import ProductListSkeleton from "../components/skeletons/ProductListSkeleton";

import { useProducts } from "../features/products/useProducts";
import LoaderError from "../ui/LoaderError";

function ProductPage() {
  const [layoutStyle, setLayoutStyle] = useState("grid");

  usePrices();

  const {
    data: productsData,
    isPending: isLoadingProducts,
    isPlaceholderData,
    error: productsError,
  } = useProducts();

  const [searchParams, setSearchParams] = useSearchParams();
  const [sortType, setSortType] = useState(searchParams.get("sort") || "title");
  const [resetKey, setResetKey] = useState(0);
  const paginationDetails = productsData?.pagination;
  const products = productsData?.products ?? [];

  function getStockLevel() {
    if (searchParams.has("stock_gt")) {
      return "in-stock";
    }

    if (searchParams.has("stock_lte")) {
      return "low-stock";
    }

    if (searchParams.has("stock_e")) {
      return "out-of-stock";
    }

    return "all";
  }

  // Initial filter values
  const [filters, setFilters] = useState({
    search: searchParams.get("title") || "",
    productId: searchParams.get("id") || "",
    category: searchParams.get("category") || "all",
    subcategory: searchParams.get("subcategory") || "all",
    priceRange:
      searchParams.get("price_gte") || searchParams.get("price_lte")
        ? {
            min: searchParams.get("price_gte") ?? "",
            max: searchParams.get("price_lte") ?? "",
          }
        : null,
    stockLevel: getStockLevel(),
  });

  // Updating filters state
  const handleUpdateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,

      ...(key === "category" && {
        subcategory: "all",
      }),
    }));
  };

  if (isLoadingProducts || !paginationDetails) {
    return <ProductListSkeleton length={10} />;
  }

  if (productsError) {
    return <LoaderError />;
  }

  const rangeStart =
    (paginationDetails.page - 1) * paginationDetails.pageSize + 1;

  const rangeEnd = Math.min(
    paginationDetails.page * paginationDetails.pageSize,
    paginationDetails.total,
  );

  function handleResetFilters() {
    setSearchParams({}); // clears the URL through the router, so the products refetch

    setFilters({
      search: "",
      productId: "",
      category: "all",
      subcategory: "all",
      priceRange: null, // the sidebar fills in the default range again when it mounts
      stockLevel: "all",
    });

    setSortType("");

    setResetKey((k) => k + 1); // remount the sidebar to clear its own state
  }

  function handleSort(selectedSort) {
    setSortType(selectedSort);
    setSearchParams({ sort: selectedSort });
  }

  function handleReverseSort() {
    const newSortType = sortType.startsWith("-")
      ? sortType.slice(1)
      : "-" + sortType;

    setSortType(newSortType);
    setSearchParams({ sort: newSortType });
  }

  return (
    <div className="lg:flex px-4 gap-8">
      <aside>
        <FiltersSidebar
          key={resetKey}
          onUpdateFilter={handleUpdateFilter}
          filters={filters} // Pass effectivePriceRange into filter, othwersie it's gonna be null
          onResetFilters={handleResetFilters}
        />
      </aside>
      {/* PRODUCTS */}
      <section className="flex-1">
        <div className="flex justify-between items-center bg-zinc-900/50 p-4 rounded-2xl border border-zinc-500/5 mb-8">
          <div className="flex items-center">
            <Filter
              size={16}
              aria-hidden="true"
              className="inline-block mr-2"
            />
            <p className="text-zinc-400">
              {paginationDetails.total === 0 ? (
                <>
                  Showing <span className="font-bold text-white">0</span>{" "}
                  products
                </>
              ) : (
                <>
                  Showing{" "}
                  <span className="font-bold text-white">
                    {rangeStart}–{rangeEnd}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-accent">
                    {paginationDetails.total}
                  </span>{" "}
                  products
                </>
              )}
            </p>
          </div>

          <div className="flex gap-4">
            <div className="flex items-center gap-1">
              <button className="cursor-pointer" onClick={handleReverseSort}>
                <ArrowUpDown size={18} />
              </button>
              <select
                className="input-field py-1.5 px-3 text-xs text-header cursor-pointer"
                value={sortType}
                onChange={(e) => {
                  // setSelectedSort(e.target.value);
                  handleSort(e.target.value);
                }}
              >
                <option value="title">By Name</option>
                <option value="price">By Price</option>
                <option value="rating">By Rating</option>
              </select>
            </div>
            <div
              className={`hidden sm:flex bg-zinc-900 rounded-xl p-1 border border-white/5 ${layoutStyle === "grid" && "bg-accent text-accent"}`}
            >
              <button
                className={`transition-all p-2 text-main rounded-lg ${layoutStyle === "grid" ? "bg-accent/10 text-accent" : "text-main bg-none hover:text-header "}`}
                onClick={() => setLayoutStyle("grid")}
              >
                <LayoutGrid
                  size={20}
                  aria-hidden="true"
                  className={`transition-all ${layoutStyle === "grid" && " text-accent"}`}
                />
              </button>
              <button
                className={`transition-all p-2 text-main rounded-lg ${layoutStyle === "list" ? "bg-accent/10 text-accent" : "text-main bg-none hover:text-header "}`}
                onClick={() => setLayoutStyle("list")}
              >
                <List
                  size={20}
                  aria-hidden="true"
                  className={`transition-all ${layoutStyle === "list" && " text-accent"}`}
                />
              </button>
            </div>
          </div>
        </div>
        <div
          className={`transition-opacity ${isPlaceholderData ? "opacity-50" : ""}`}
        >
          <ProductList products={products} layout={layoutStyle} />
        </div>
        <Pagination paginationDetails={paginationDetails} />
      </section>
    </div>
  );
}

export default ProductPage;
