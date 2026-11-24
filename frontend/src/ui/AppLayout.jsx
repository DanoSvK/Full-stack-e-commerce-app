import { Outlet } from "react-router-dom";

import Footer from "../components/Footer";
import Header from "../components/Header";
import ScrollToTop from "../utils/ScrollToTop";
import { CartProvider } from "../context/CartContext";
import { AuthProvider } from "../context/AuthContext";
import { WishlistContextProvider } from "../context/WishlistContext";

function AppLayout() {
  return (
    <>
      <ScrollToTop />
      <AuthProvider>
        <WishlistContextProvider>
          <div className="selection:bg-accent selection:text-black bg-zinc-950 min-h-screen text-main font-sans flex flex-col">
            <CartProvider>
              <Header />
              <main className="flex-1 max-w-7xl m-auto w-full px-4 sm:px-6 lg:px-8">
                <Outlet />
              </main>
            </CartProvider>
            <Footer />
          </div>
        </WishlistContextProvider>
      </AuthProvider>
    </>
  );
}

export default AppLayout;
