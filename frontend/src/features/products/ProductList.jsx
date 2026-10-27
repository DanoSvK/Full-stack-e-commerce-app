import ProductCard from "./ProductCard";
function ProductList({ products, layout }) {
  return (
    <div
      className={`grid ${layout === "list" ? "grid-cols-1 gap-4" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"}`}
    >
      {products.map((product) => (
        <ProductCard product={product} key={product.id} layout={layout} />
      ))}
    </div>
  );
}

export default ProductList;
