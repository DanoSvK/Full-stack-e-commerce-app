import ProductCard from "../components/ProductCard";
import ProductList from "../components/ProductList";
import FiltersSidebar from "../components/FiltersSidebar";

import { useState } from "react";
import { products } from "../../products";
import { Filter, ChevronDown, LayoutGrid, List } from "lucide-react";

function ProductPage() {
  const [filters, setFilters] = useState({
    search: "",
    productId: "",
    category: "all",
    subcategory: "all",
    priceRange: { min: 0, max: 1000 },
    stockLevel: "all",
  });

  // DERIVE CATEGORIES FROM PRODUCTS FOR FILTER
  const categories = [
    "all",
    ...new Set(products.map((p) => p.category.toLowerCase())),
  ];

  function CalcStockLevel(stock) {
    switch (filters.stockLevel) {
      case stock < 10:
    }
  }

  // DERIVE SUBCATEGORIES FROM CATEGORIES FOR FILTER
  const subcategories =
    filters.category === "all"
      ? [] // no subcategories at all
      : [
          "all",
          ...new Set(
            products
              .filter(
                (product) =>
                  product.category.toLowerCase() === filters.category,
              )
              .map((product) => product.subcategory.toLowerCase()),
          ),
        ];

  const handleUpdateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,

      ...(key === "category" && {
        subcategory: "all",
      }),
    }));
  };

  const filteredProducts = products.filter((product) => {
    return (
      product.name.toLowerCase().includes(filters.search.toLowerCase()) &&
      product.id.toLowerCase().includes(filters.productId.toLowerCase()) &&
      (filters.category === "all" ||
        product.category.toLowerCase() === filters.category) &&
      (filters.subcategory === "all" ||
        product.subcategory.toLowerCase() === filters.subcategory) &&
      product.price >= filters.priceRange.min &&
      product.price <= filters.priceRange.max
    );
  });

  return (
    <div className="lg:flex px-4 gap-8">
      {/* FILTERS */}
      <aside>
        <FiltersSidebar
          onUpdateFilter={handleUpdateFilter}
          filters={filters}
          categories={categories}
          subcategories={subcategories}
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
        <ProductList products={filteredProducts} />
      </section>
    </div>
  );
}

export default ProductPage;
