import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { usePrices } from "../features/products/usePrices";

import { Filter, ChevronDown, LayoutGrid, List } from "lucide-react";

import ProductCard from "../features/products/ProductCard";
import ProductList from "../features/products/ProductList";
import FiltersSidebar from "../features/products/FiltersSidebar";
import Pagination from "../ui/Pagination";

import ProductListSkeleton from "../components/skeletons/ProductListSkeleton";

import { useProducts } from "../features/products/useProducts";

function ProductPage() {
  usePrices();

  const {
    data: productsData,
    isPending: isFetchingProducts,
    error: productsError,
  } = useProducts();

  const [searchParams] = useSearchParams();

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
            min: searchParams.get("price_gte"),
            max: searchParams.get("price_lte"),
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

  // if (filters.search)
  // const filteredProducts = products.filter((product) => {
  //   return (
  //     product.name.toLowerCase().includes(filters.search.toLowerCase()) &&
  //     product.id.toLowerCase().includes(filters.productId.toLowerCase()) &&
  //     (filters.category === "all" ||
  //       product.category.toLowerCase() === filters.category) &&
  //     (filters.subcategory === "all" ||
  //       product.subcategory.toLowerCase() === filters.subcategory) &&
  //     product.price >= filters.priceRange.min &&
  //     product.price <= filters.priceRange.max
  //   );
  // });

  if (productsError) {
    <div>Error</div>;
  }

  return (
    <div className="lg:flex px-4 gap-8">
      <aside>
        <FiltersSidebar
          onUpdateFilter={handleUpdateFilter}
          filters={filters} // Pass effectivePriceRange into filter, othwersie it's gonna be null
        />
      </aside>
      {/* PRODUCTS */}
      <section className="flex-1">
        <div className="flex justify-between items-center bg-zinc-900/50 p-4 rounded-2xl border border-white/5 mb-8">
          <div className="flex items-center">
            <Filter
              size={16}
              aria-hidden="true"
              className="inline-block mr-2"
            />
            <p>
              Showing <span>48</span> products
            </p>
          </div>
          <div className="flex">
            <button className="p-2 text-accent bg-accent/10 rounded-lg">
              <LayoutGrid size={20} aria-hidden="true" />
            </button>
            <button className="p-2 text-zinc-500 hover:text-white">
              <List size={20} aria-hidden="true" />
            </button>
          </div>
        </div>
        {isFetchingProducts ? (
          <ProductListSkeleton />
        ) : productsError ? (
          <p>Could not load products</p>
        ) : (
          <>
            <ProductList products={products} />
            <Pagination paginationDetails={paginationDetails} />
          </>
        )}
      </section>
    </div>
  );
}

export default ProductPage;
