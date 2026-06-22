import ProductCard from "./ProductCard";
import { useWishlist } from "../../api/useCreateWishlistItem";

function ProductList({ products }) {
  const { addItemToWishlist } = useWishlist();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard
          product={product}
          key={product.id}
          onAddItemToWishlist={addItemToWishlist}
        />
      ))}
    </div>
  );
}

export default ProductList;
