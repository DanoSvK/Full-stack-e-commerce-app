import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Logo from "./Logo";

import {
  Search,
  ShoppingCart,
  User,
  LogOut,
  Menu,
  X,
  LogIn,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function Header() {
  const { totalCartCount } = useCart();
  const { logout, user } = useAuth();

  return (
    <header className="backdrop-blur-md py-5 sticky top-0 z-15 bg-zinc-950/80 shadow-lg mb-24 w-full border-b border-white/10 m-auto">
      <div className="flex justify-between items-center max-w-7xl m-auto px-4 sm:px-6 lg:px-8">
        <Logo />
        <Navbar />
        <div className="flex gap-7 items-center ml-auto">
          <Link
            to="/cart"
            className="relative p-2 hover:text-accent transition-colors"
            aria-label="Open shopping cart"
          >
            <ShoppingCart />
            {totalCartCount > 0 && (
              <span className="absolute top-0 right-0 bg-accent text-zinc-950 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalCartCount}
              </span>
            )}
          </Link>
          {user && (
            <Link
              to="/account"
              className="hidden sm:block hover:text-accent "
              aria-label="Open user account"
            >
              <User />
            </Link>
          )}
          {user ? (
            <button
              type="submit"
              className="hidden sm:block hover:text-red-500 cursor-pointer"
              aria-label="Logout"
              onClick={logout}
            >
              <LogOut />
            </button>
          ) : (
            <Link
              to="/login"
              type="submit"
              className="hidden sm:block hover:text-green-500 cursor-pointer"
              aria-label="Login"
            >
              <LogIn />
            </Link>
          )}
          <Link
            className="md:hidden hover:text-accent"
            aria-label="Open menu bar"
          >
            <Menu />
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
