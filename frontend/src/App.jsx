import { createBrowserRouter, RouterProvider } from "react-router-dom";

import HomePage from "./routes/HomePage";
import AppLayout from "./ui/AppLayout";
import ProductPage from "./routes/ProductPage";
import CatalogPage from "./routes/CatalogPage";
import ExperimentPage from "./routes/ExperimentPage";
import WeblayerPage from "./routes/WeblayerPage";
import AccountPage from "./routes/AccountPage";
import CartPage from "./routes/CartPage";
import ProductDetailPage from "./routes/ProductDetailPage";
import LoginPage from "./routes/LoginPage";
import SignupPage from "./routes/SignupPage";
import ForgotPasswordPage from "./routes/ForgotPasswordPage";
import ResetPassword from "./routes/ResetPasswordPage";
import ProtectedLayout from "./components/ProtectedLayout";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/home", element: <HomePage /> },
      { path: "/products", element: <ProductPage /> },
      { path: "/catalogs", element: <CatalogPage /> },
      { path: "/experiments", element: <ExperimentPage /> },
      { path: "/weblayers", element: <WeblayerPage /> },
      { path: "/cart", element: <CartPage /> },
      { path: "/products/:prodId", element: <ProductDetailPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/signup", element: <SignupPage /> },
      { path: "/forgot-password", element: <ForgotPasswordPage /> },
      { path: "/reset-password", element: <ResetPassword /> },
      {
        element: <ProtectedLayout />,
        children: [{ path: "/account", element: <AccountPage /> }],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
