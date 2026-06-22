import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function SignupForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setpasswordConfirm] = useState("");
  const { signup, user, error, loading } = useAuth();
  const navigate = useNavigate();

  if (user) {
    navigate("/home");
    return; // or a loading spinner
  }

  function handleSubmit(e) {
    e.preventDefault();
    signup(username, email, password, passwordConfirm);
  }

  return (
    <>
      {error?.message && <p className="text-red-500 mb-4">{error.message}</p>}
      <div>
        <h1 className="text-3xl font-bold mb-4">Signup Page</h1>
        <form
          className="border border-gray-300 p-4 rounded-lg mb-4 glass-card"
          onSubmit={handleSubmit}
        >
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium mb-1"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-accent input-field"
              placeholder="Enter your username"
              onInput={(e) => {
                setUsername(e.target.value);
              }}
            />
            {error?.fieldErrors?.username && (
              <p className="text-red-500 mb-4">{error.fieldErrors.username}</p>
            )}
          </div>
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
            {error?.fieldErrors?.email && (
              <p className="text-red-500 mb-4">{error.fieldErrors.email}</p>
            )}
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
            {error?.fieldErrors?.password && (
              <p className="text-red-500 mb-4">{error.fieldErrors.password}</p>
            )}
            {/* {formErrors.password && (
              <p className="text-red-500 mb-4">{formErrors.password}</p>
            )} */}
          </div>
          <div className="mb-4">
            <label
              htmlFor="passwordConfirm"
              className="block text-sm font-medium mb-1"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="passwordConfirm"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-accent input-field"
              placeholder="Confirm your password"
              onInput={(e) => setpasswordConfirm(e.target.value)}
            />
            {error?.fieldErrors?.passwordConfirm && (
              <p className="text-red-500 mb-4">
                {error.fieldErrors.passwordConfirm}
              </p>
            )}
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
        <p>
          Already have an account?{" "}
          <a href="/login" className="text-accent hover:underline">
            Login
          </a>
        </p>
      </div>
    </>
  );
}

export default SignupForm;
