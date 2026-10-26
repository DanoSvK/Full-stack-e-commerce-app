import Logo from "./Logo";
import SearchBar from "../components/SearchBar";
import CartIcon from "../components/CartIcon";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  const navLinkClass = ({ isActive }) => (isActive ? "text-accent" : "");

  return (
    <nav className="hidden md:block flex-1">
      <ul className="flex gap-6 text-sm items-center justify-center">
        <li className="hover:text-accent-hover">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
        </li>
        <li className="hover:text-accent">
          <NavLink to="/products" className={navLinkClass}>
            Shop All
          </NavLink>
        </li>
        <li className="hover:text-accent">
          <NavLink to="/catalogs" className={navLinkClass}>
            Collections
          </NavLink>
        </li>
        <li className="hover:text-accent">
          <NavLink to="/experiments" className={navLinkClass}>
            Deals & Drops
          </NavLink>
        </li>
        <li className="hover:text-accent">
          <NavLink to="/account" className={navLinkClass}>
            My Account
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
