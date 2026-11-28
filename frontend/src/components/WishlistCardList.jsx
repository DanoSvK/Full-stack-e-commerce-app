import WishlistCard from "./WishlistCard";

function WishlistCardList({ wishlistProducts, user }) {
  return (
    <>
      {wishlistProducts.map((product) => (
        <WishlistCard key={product.id} product={product} user={user} />
      ))}
    </>
  );
}

export default WishlistCardList;
