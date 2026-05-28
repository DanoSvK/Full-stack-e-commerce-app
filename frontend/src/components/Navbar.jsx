import Logo from "../ui/Logo";
import SearchBar from "./SearchBar";
import CartIcon from "./CartIcon";
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
            Products
          </NavLink>
        </li>
        <li className="hover:text-accent">
          <NavLink to="/catalogs" className={navLinkClass}>
            Catalogs
          </NavLink>
        </li>
        <li className="hover:text-accent">
          <NavLink to="/experiments" className={navLinkClass}>
            Experiments
          </NavLink>
        </li>
        <li className="hover:text-accent">
          <NavLink to="/weblayers" className={navLinkClass}>
            Weblayers
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
