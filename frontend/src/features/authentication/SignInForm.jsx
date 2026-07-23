import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loginWithGoogle, user, error, loading } = useAuth();

  if (user) {
    return <Navigate to="/home" replace />;
  }

  function handleSubmit(e) {
    e.preventDefault();
    login(email, password);
  }

  return (
    <>
      {error?.message && <p className="text-red-500 mb-4">{error.message}</p>}
      <section className="max-w-lg m-auto">
        <div>
          <h1 className="text-3xl font-bold mb-4 text-white">Login</h1>
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
        </div>
        <div className="flex items-center mb-4">
          <div className="flex-1 h-px bg-gray-300"></div>

          <span className="px-4 text-gray-500">or</span>

          <div className="flex-1 h-px bg-gray-300"></div>
        </div>
        <button
          className="glass-card flex items-center justify-center gap-2 w-full py-2 px-4 mb-4 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
          onClick={loginWithGoogle}
        >
          <FcGoogle />
          Continue with Google
        </button>
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
      </section>
    </>
  );
}

export default SignInForm;
