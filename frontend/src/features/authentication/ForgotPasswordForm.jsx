import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const { forgotPassword, error, loading } = useAuth();

  function handleSubmit(e) {
    e.preventDefault();
    forgotPassword(email);
  }

  return (
    <>
      {error && <p className="text-red-500 mb-4">{error.message}</p>}
      <div>
        <h1 className="text-3xl font-bold mb-4">Forgot your password?</h1>
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
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Sending reset link..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </>
  );
}

export default ForgotPasswordForm;
