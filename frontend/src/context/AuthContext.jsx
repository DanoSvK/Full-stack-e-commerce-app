import { createContext, useContext, useState } from "react";
import { bre } from "../utils/bloomreach";

const brSDK = bre();

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");

    return storedUser ? JSON.parse(storedUser) : null;
  });

  function handleGoogleLogin(response) {
    const payload = JSON.parse(atob(response.credential.split(".")[1]));

    const userData = {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      emailVerified: payload.email_verified,
    };

    localStorage.setItem("user", JSON.stringify(userData));

    setUser(userData);

    brSDK?.identify({
      customer_id: userData.email,
    });
  }

  function initializeGoogleButton(element) {
    if (!window.google || !element) return;

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleGoogleLogin,
      auto_select: false,
    });

    window.google.accounts.id.renderButton(element, {
      theme: "outline",
      size: "large",
      type: "standard",
    });
  }

  function logout() {
    if (window.google) {
      window.google.accounts.id.disableAutoSelect();
    }

    localStorage.removeItem("user");
    setUser(null);
    brSDK?.anonymize();
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        logout,
        initializeGoogleButton,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
