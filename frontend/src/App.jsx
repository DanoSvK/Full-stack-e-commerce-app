import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
});

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
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster
        position="top-center"
        gutter={12}
        containerStyle={{ margin: "8px" }}
        toastOptions={{
          success: { duration: 3000 },
          error: { duration: 5000 },
          style: {
            fontSize: "16px",
            maxWidth: "500px",
            backgroundColor: "#2B3136",
            color: "#fff",
          },
        }}
      />
    </QueryClientProvider>
  );
}

export default App;
