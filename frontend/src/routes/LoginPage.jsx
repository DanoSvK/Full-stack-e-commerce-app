import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, user, error, loading } = useAuth();
  const navigate = useNavigate();

  if (user) {
    navigate("/home");
    return; // or a loading spinner
  }

  function handleSubmit(e) {
    e.preventDefault();
    login(email, password);
  }

  return (
    <>
      {error?.message && <p className="text-red-500 mb-4">{error.message}</p>}
      <div>
        <h1 className="text-3xl font-bold mb-4">Login Page</h1>
        <form
          className="border border-gray-300 p-4 rounded-lg mb-4 glass-card"
          onSubmit={handleSubmit}
        >
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-accent input-field"
              placeholder="Enter your email"
              onInput={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-accent input-field"
              placeholder="Enter your password"
              onInput={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="text-sm text-gray-500 flex justify-between">
          <p>
            Don't have an account?{" "}
            <a href="/signup" className="text-accent hover:underline">
              Sign up
            </a>
          </p>
          <p>
            Forgot your password?{" "}
            <a href="/forgot-password" className="text-accent hover:underline">
              Reset it
            </a>
          </p>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
