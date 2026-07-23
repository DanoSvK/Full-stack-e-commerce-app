import { NavLink } from "react-router-dom";
import Navbar from "./Navbar";
import {
  BookIcon,
  HomeIcon,
  LayersIcon,
  PackageIcon,
  FlaskConical,
  LogOut,
  LogIn,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

function MenuModal({ setMenu }) {
  const { logout, user } = useAuth();

  const style = ({ isActive }) =>
    `flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all duration-150 ${
      isActive
        ? "bg-yellow-400/10 text-yellow-400"
        : "text-white/50 hover:text-accent"
    }`;

  return (
    <nav className="text-[13.5px] font-medium tracking-[0.01em] fixed top-15 right-5 z-50 bg-zinc-900/95 backdrop-blur-sm border border-white/6 rounded-2xl p-1.5 overflow-hidden">
      <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-yellow-400/3 to-transparent pointer-events-none" />

      <ul className="flex flex-col gap-0.5 relative">
        <li>
          <NavLink to="/" className={style} onClick={() => setMenu(false)}>
            <HomeIcon className="w-4 h-4" />
            Home
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/products"
            className={style}
            onClick={() => setMenu(false)}
          >
            <PackageIcon className="w-4 h-4" />
            Products
          </NavLink>
        </li>

        <div className="h-px bg-white/6 mx-2 my-1" />

        <li className="flex flex-row">
          <NavLink
            to="/catalogs"
            className={style}
            onClick={() => setMenu(false)}
          >
            <BookIcon className="w-4 h-4" />
            Catalogs
          </NavLink>
        </li>

        <li className="flex flex-row">
          <NavLink
            to="/experiments"
            className={style}
            onClick={() => setMenu(false)}
          >
            <FlaskConical className="w-4 h-4" />
            Experiments
          </NavLink>
        </li>

        <li className="flex flex-row">
          <NavLink
            to="/weblayers"
            className={style}
            onClick={() => setMenu(false)}
          >
            <LayersIcon className="w-4 h-4" />
            Weblayers
          </NavLink>
        </li>

        <div className="sm:hidden h-px bg-white/6 mx-2 my-1" />

        {user ? (
          <li className="flex flex-row sm:hidden">
            <button
              type="submit"
              aria-label="Logout"
              className={`text-red-500 cursor-pointer w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all duration-150 hover:bg-red-500/10`}
              onClick={() => {
                logout();
                setMenu(false);
              }}
            >
              <LogOut className="w-4 h-4 text-red-500" />
              Logout
            </button>
          </li>
        ) : (
          <li className="flex flex-row sm:hidden">
            <NavLink
              to="/login"
              aria-label="Login"
              className={({ isActive }) =>
                `text-green-500 cursor-pointer w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all duration-150 hover:bg-green-500/10 ${isActive ? "bg-green-500/10" : ""}`
              }
              onClick={() => setMenu(false)}
            >
              <LogIn className="w-4 h-4 text-green-500" />
              Login
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default MenuModal;
