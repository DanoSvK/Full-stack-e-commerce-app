import WishlistCard from "./WishlistCard";

function WishlistCardList({ wishlistProducts, user }) {
  return (
    <>
      {wishlistProducts.map((product) => (
        <WishlistCard product={product} user={user} />
      ))}
    </>
  );
}

export default WishlistCardList;
