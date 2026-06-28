import ProductCardSkeleton from "./ProductCardSkeleton";

function ProductListSkeleton({ length }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: length }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default ProductListSkeleton;
