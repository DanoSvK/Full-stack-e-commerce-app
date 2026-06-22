import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const { resetPassword, error, loading } = useAuth();

  function handleSubmit(e) {
    e.preventDefault();
    resetPassword(password, passwordConfirm);
  }

  return (
    <>
      {error?.message && <p className="text-red-500 mb-4">{error.message}</p>}
      <div>
        <h1 className="text-3xl font-bold mb-4">Reset your password</h1>
        <form
          className="border border-gray-300 p-4 rounded-lg mb-4 glass-card"
          onSubmit={handleSubmit}
        >
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
              placeholder="Enter your new password"
              onInput={(e) => setPassword(e.target.value)}
            />
            {error?.fieldErrors?.password && (
              <p className="text-red-500 mb-4">{error.fieldErrors.password}</p>
            )}
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
              placeholder="Confirm your new password"
              onInput={(e) => setPasswordConfirm(e.target.value)}
            />
            {error?.fieldErrors?.passwordConfirm && (
              <p className="text-red-500 mb-4">
                {error.fieldErrors.passwordConfirm}
              </p>
            )}
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </>
  );
}

export default ResetPasswordForm;
