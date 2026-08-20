import { createBrowserRouter, RouterProvider } from "react-router-dom";

import HomePage from "./routes/HomePage";
import AppLayout from "./ui/AppLayout";
import ProductPage from "./routes/ProductPage";
import ExperimentPage from "./routes/ExperimentPage";
import WeblayerPage from "./routes/WeblayerPage";
import AccountPage from "./routes/AccountPage";
import CartPage from "./routes/CartPage";
import ProductDetailPage from "./routes/ProductDetailPage";
import LoginPage from "./routes/LoginPage";
import WishlistPage from "./routes/WishlistPage";
import UserOptions from "./routes/UserOptions";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/home", element: <HomePage /> },
      { path: "/products", element: <ProductPage /> },
      { path: "/experiments", element: <ExperimentPage /> },
      { path: "/weblayers", element: <WeblayerPage /> },
      { path: "/account", element: <AccountPage /> },
      { path: "/cart", element: <CartPage /> },
      { path: "/wishlist", element: <WishlistPage /> },
      { path: "/products/:prodId", element: <ProductDetailPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/user_options", element: <UserOptions /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
