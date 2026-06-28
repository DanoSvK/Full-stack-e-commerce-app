import CustomerPropertySkeleton from "./CustomerPropertySkeleton";

function ProductListSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <CustomerPropertySkeleton key={i} />
      ))}
    </>
  );
}

export default ProductListSkeleton;
