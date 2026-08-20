import { Outlet } from "react-router-dom";

import Footer from "../components/Footer";
import Header from "../components/Header";
import ScrollToTop from "../utils/ScrollToTop";
import { CartProvider } from "../context/CartContext";
import Wishlist from "../components/AccountMenuOptions/Wishlist";
import { WishlistProvider } from "../context/WishlistContext";
import { AuthProvider } from "../context/AuthContext";

function AppLayout() {
  return (
    <>
      <ScrollToTop />
      <div className="selection:bg-accent selection:text-black bg-zinc-950 min-h-screen text-zinc-400 font-sans flex flex-col">
        <CartProvider>
          <AuthProvider>
            <Header />
            <WishlistProvider>
              <main className="flex-1 max-w-116.5 m-auto w-full px-4 sm:max-w-162.5 lg:max-w-7xl lg:px-8">
                <div>
                  <Outlet />
                </div>
              </main>
            </WishlistProvider>
          </AuthProvider>
        </CartProvider>
        <Footer />
      </div>
    </>
  );
}

export default AppLayout;
