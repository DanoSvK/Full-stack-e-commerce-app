import { Key, TriangleAlert } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";

function Security() {
  const [currentPassword, setCurrentPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const { error, updatePassword, deleteMe } = useAuth();

  function handleSubmit(e) {
    e.preventDefault();
    updatePassword(currentPassword, newPassword, confirmPassword);
  }

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        setIsDeletingAccount(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      {isDeletingAccount && (
        <div
          className="fixed inset-0 bg-black/50 z-9"
          onClick={() => setIsDeletingAccount(false)}
        />
      )}
      {isDeletingAccount && (
        <div className="glass-card p-8 rounded-3xl space-y-4 max-w-2xl mb-4 absolute top-3/6 left-3/6 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <h4 className="border-b border-zinc-700 pb-2">Delete Account</h4>
          <p className="text-zinc-500 p-4 text-sm">
            Are you sure you want to delete your account? This action cannot be
            undone. After deleting your account, all your data will be
            permanently removed from our servers.
          </p>
          <div className="flex gap-4">
            <button className="btn-danger-secondary" onClick={deleteMe}>
              Delete Account
            </button>
            <button
              className="btn-secondary"
              onClick={() => setIsDeletingAccount(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <h2 className="text-3xl font-black tracking-tighter text-white uppercase mb-8">
        Security Settings
      </h2>

      <article className="glass-card p-8 rounded-3xl space-y-8 max-w-2xl mb-4">
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
      <h1 className="text-2xl font-bold text-white mb-4">Danger Zone</h1>
      <article className="glass-card p-8 rounded-3xl space-y-8 max-w-2xl">
        <header className="flex items-center mb-8 gap-6">
          <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
            <TriangleAlert aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">Delete Account</h2>
            <p className="text-zinc-500 text-sm">
              Permanently delete your account and all associated data.
            </p>
          </div>
        </header>
        <button
          className="btn-danger"
          onClick={() => setIsDeletingAccount(true)}
        >
          Delete Account
        </button>
      </article>
    </>
  );
}

export default Security;
