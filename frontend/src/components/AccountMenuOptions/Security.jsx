import { Key } from "lucide-react";

function Security() {
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

        <form className="space-y-4">
          <fieldset>
            <legend className="sr-only">Change password</legend>

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
              />
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
              />
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
