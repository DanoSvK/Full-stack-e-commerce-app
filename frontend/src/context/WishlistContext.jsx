import { createContext, useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthContext";
import { useWishlist } from "../features/wishlist/useWishlist";
import { useSyncWishlist } from "../features/wishlist/useSyncWishlist";

export const WishlistContext = createContext({
  wishlistCtx: [],
  addToWishlistCtx: () => {},
  removeFromWishlistCtx: () => {},
  removeWishlistCtx: () => {},
});

export function WishlistContextProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    return JSON.parse(localStorage.getItem("wishlist") || "[]");
  });

  const { user, isAuthLoading } = useAuth();

  const { mutateAsync: syncWishlist } = useSyncWishlist();

  const { data: wishlistDB = [] } = useWishlist(!!user && !isAuthLoading);

  const hasSynced = useRef(false);

  useEffect(() => {
    if (!user || hasSynced.current) return;

    hasSynced.current = true;

    async function syncGuestWishlist() {
      if (wishlist.length === 0) return;

      try {
        await syncWishlist(wishlist);
        setWishlist(wishlistDB.map((item) => item.productId));
      } catch (error) {
        console.error("Wishlist sync failed:", error);
      }
    }

    syncGuestWishlist();
  }, [user, syncWishlist, wishlist, wishlistDB]);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  function addToWishlist(id) {
    setWishlist((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }

  function removeFromWishlist(id) {
    setWishlist((prev) => prev.filter((itemId) => itemId !== id));
  }

  function removeWishlist() {
    setWishlist([]);
  }

  useEffect(() => {
    function handleLogout() {
      removeWishlist();
    }

    window.addEventListener("user-logout", handleLogout);

    return () => {
      window.removeEventListener("user-logout", handleLogout);
    };
  }, []);

  return (
    <WishlistContext
      value={{
        wishlistCtx: wishlist,
        addToWishlistCtx: addToWishlist,
        removeFromWishlistCtx: removeFromWishlist,
        removeWishlistCtx: removeWishlist,
      }}
    >
      {children}
    </WishlistContext>
  );
}
