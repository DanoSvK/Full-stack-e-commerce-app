import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Logo from "../ui/Logo";
import { useAuth } from "../context/AuthContext";

import {
  Search,
  ShoppingCart,
  User,
  LogOut,
  LogIn,
  Menu,
  X,
  Heart,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useState } from "react";
import MenuModal from "./MenuModal";
import { NavLink } from "react-router-dom";

function Header() {
  const { totalCartCount } = useCart();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="backdrop-blur-md py-5 sticky top-0 z-15 bg-zinc-950/80 shadow-lg mb-24 w-full border-b border-white/10 m-auto">
      <div className="flex justify-between items-center max-w-7xl m-auto px-4 sm:px-6 lg:px-8">
        <Logo />
        <Navbar />
        <div className="flex gap-7 items-center ml-auto">
          <Link
            to="/user_options"
            className="relative p-2 hover:text-accent transition-colors"
            aria-label="Open shopping cart"
          >
            <User />
            {totalCartCount > 0 && (
              <span className="absolute top-0 right-0 bg-accent text-zinc-950 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalCartCount}
              </span>
            )}
          </Link>
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
          <Link
            to="/wishlist"
            className="hidden p-2 sm:block hover:text-accent"
            aria-label="Open user account"
          >
            <Heart />
          </Link>
          {user ? (
            <Link
              className="hidden sm:block hover:text-red-500"
              aria-label="Logout"
              onClick={logout}
            >
              <LogOut />
            </Link>
          ) : (
            <NavLink
              to="/login"
              aria-label="Login"
              className={({ isActive }) =>
                `hidden sm:flex text-green-500 cursor-pointer w-full items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all duration-150 hover:bg-green-500/10 ${isActive ? "bg-green-500/10" : ""}`
              }
            >
              <LogIn className="w-4 h-4 text-green-500" />
              Login
            </NavLink>
          )}

          <div className="relative min-[880px]:hidden flex items-center">
            <button
              className="hover:text-accent cursor-pointer"
              aria-label="Open menu bar"
              onClick={() => setIsMenuOpen((prev) => !prev)}
            >
              <Menu />
            </button>
            {isMenuOpen && <MenuModal setMenu={setIsMenuOpen} />}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
