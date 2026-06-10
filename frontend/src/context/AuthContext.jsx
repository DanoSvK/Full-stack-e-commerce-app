import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { bre } from "../utils/bloomreach";

const sdk = bre();

const AuthContext = createContext();

const API = "http://localhost:3000/api/v1"; // your base URL

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const resetPasswordToken = searchParams.get("token"); // get token from URL
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await fetch(`${API}/users/me`, {
          credentials: "include",
          cache: "no-store",
        });

        if (!res.ok) {
          setUser(null);
          return;
        }

        const data = await res.json();

        setUser(data.data.user);
      } catch (err) {
        console.error("err:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const signup = async (username, email, password, passwordConfirm) => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/users/signup`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, passwordConfirm }),
      });
      const data = await res.json();

      if (!res.ok) {
        // field validation errors
        if (data.errors?.fieldErrors) {
          throw { fieldErrors: data.errors.fieldErrors };
        }
        // general error (wrong password, user exists, etc.)
        throw { message: data.message };
      }
      setUser(data.data.user);
      sdk?.identify({ registered: data.data.user.email });
      sdk?.track("registration", {
        registration_method: "email",
        account_type: data.data.user.role,
        email: data.data.user.email,
      });
      navigate("/home");
    } catch (err) {
      setError({
        fieldErrors: err.fieldErrors ?? null,
        message: err.message ?? null,
      });
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/users/login`, {
        method: "POST",
        credentials: "include", // sends/receives the httpOnly cookie
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setUser(data.data.user);
      sdk?.identify({ registered: data.data.user.email });
      navigate("/home");
    } catch (err) {
      setError({ message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = () => {
    window.location.href = "http://localhost:3000/api/v1/users/oauth/login";
  };

  const logout = async () => {
    const res = await fetch(`${API}/users/logout`, {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Logout failed");
    setUser(null);
    navigate("/home"); // redirect after logout
  };

  const forgotPassword = async (email) => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/users/forgotPassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
    } catch (err) {
      setError({ message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (password, passwordConfirm) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API}/users/resetPassword/${resetPasswordToken}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password, passwordConfirm }),
        },
      );

      const data = await res.json();
      if (!res.ok)
        throw { message: data.message, fieldErrors: data.errors?.fieldErrors };

      setUser(data.data.user);
      navigate("/home"); // redirect after password reset
    } catch (err) {
      setError({
        message: err.message,
        fieldErrors: err.fieldErrors ?? null,
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (
    currentPassword,
    newPassword,
    passwordConfirm,
  ) => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/users/updateMyPassword`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword, passwordConfirm }),
      });

      const data = await res.json();
      if (!res.ok)
        throw { message: data.message, fieldErrors: data.errors?.fieldErrors };

      setUser(data.data.user);
    } catch (err) {
      setError({
        message: err.message,
        fieldErrors: err.fieldErrors ?? null,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        loginWithGoogle,
        signup,
        logout,
        forgotPassword,
        resetPassword,
        updatePassword,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("AuthContext was used outside of the AuthProvider");

  return context;
}

export { AuthProvider, useAuth };
