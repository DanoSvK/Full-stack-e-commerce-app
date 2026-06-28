import { Key } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

function Security() {
  const [currentPassword, setCurrentPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const { error, updatePassword } = useAuth();

  function handleSubmit(e) {
    e.preventDefault();
    updatePassword(currentPassword, newPassword, confirmPassword);
  }

  return (
    <>
      <h2 className="text-3xl font-black tracking-tighter text-white uppercase mb-8">
        Security Settings
      </h2>

      <article className="glass-card p-8 rounded-3xl space-y-8 max-w-2xl">
        <header className="flex items-center mb-8 gap-6">
          <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
            <Key aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">Change Password</h2>
            <p className="text-zinc-500 text-sm">
              Update your password to keep your account secure.
            </p>
          </div>
        </header>

        {error?.message && <p className="text-red-500 mb-4">{error.message}</p>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <fieldset>
            <div className="mb-2">
              <label
                className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest"
                htmlFor="password"
              >
                Current password
              </label>
              <input
                className="input-field w-full text-sm"
                id="password"
                type="password"
                placeholder="********"
                onInput={(e) => {
                  setCurrentPassword(e.target.value);
                }}
              />
            </div>

            <div className="mb-2">
              <label
                className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest"
                htmlFor="new-password"
              >
                New password
              </label>
              <input
                className="input-field w-full text-sm"
                id="new-password"
                type="password"
                placeholder="********"
                onInput={(e) => {
                  setNewPassword(e.target.value);
                }}
              />
              {error?.fieldErrors?.newPassword && (
                <p className="text-red-500 mb-4">{error.message}</p>
              )}
            </div>

            <div className="mb-2">
              <label
                className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest"
                htmlFor="confirm-password"
              >
                Confirm new password
              </label>
              <input
                className="input-field w-full text-sm"
                id="confirm-password"
                type="password"
                placeholder="********"
                onInput={(e) => {
                  setConfirmPassword(e.target.value);
                }}
              />
              {error?.fieldErrors?.confirmPassword && (
                <p className="text-red-500 mb-4">{error.message}</p>
              )}
            </div>
          </fieldset>

          <button className="btn-primary w-full sm:w-auto" type="submit">
            Update Password
          </button>
        </form>
      </article>
    </>
  );
}

export default Security;
