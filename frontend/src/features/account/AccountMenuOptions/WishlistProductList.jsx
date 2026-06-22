import ProductCard from "../../products/ProductCard";
import ProductList from "../../products/ProductList";

function WishlistProductList({ products }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard product={product.product} key={product.id} />
      ))}
    </div>
  );
}

export default WishlistProductList;
