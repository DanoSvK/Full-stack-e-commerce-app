import { createContext, useContext, useState } from "react";
const WishlistContext = createContext();

function WishlistProvider({ children }) {
  const [wishlistProducts, setWishlistProducts] = useState([]);

  function handleAddToWishlist(id) {
    setWishlistProducts((prev) =>
      prev.includes(id)
        ? prev.filter((productId) => productId !== id)
        : [...prev, id],
    );
  }

  // const totalWishlistCount = wishlistProducts.reduce(
  //   (sum, item) => sum + item.quantity,
  //   0,
  // );

  return (
    <WishlistContext.Provider
      value={{
        wishlistProducts: wishlistProducts,
        onAddToWishlist: handleAddToWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined)
    throw new Error("WishlistContext was used outside of the WishlistProvider");

  return context;
}

export { WishlistProvider, useWishlist };
