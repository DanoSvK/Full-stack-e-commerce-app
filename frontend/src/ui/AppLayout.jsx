import { Outlet } from "react-router-dom";

import Footer from "../ui/Footer";
import Header from "../ui/Header";
import ScrollToTop from "../utils/ScrollToTop";
import { CartProvider } from "../context/CartContext";
import Wishlist from "../features/account/AccountMenuOptions/Wishlist";
import { WishlistProvider } from "../context/WishlistContext";
import { AuthProvider } from "../context/AuthContext";

function AppLayout() {
  return (
    <>
      <ScrollToTop />
      <AuthProvider>
        <div className="selection:bg-accent selection:text-black bg-zinc-950 min-h-screen text-zinc-400 font-sans flex flex-col">
          <CartProvider>
            <Header />
            <WishlistProvider>
              <main className="flex-1 max-w-7xl m-auto w-full px-4 sm:px-6 lg:px-8">
                <div>
                  <Outlet />
                </div>
              </main>
            </WishlistProvider>
          </CartProvider>
          <Footer />
        </div>
      </AuthProvider>
    </>
  );
}

export default AppLayout;
