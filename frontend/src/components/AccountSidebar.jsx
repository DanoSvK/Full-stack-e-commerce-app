import { User, Heart, Shield, Package, LogOut } from "lucide-react";

function AccountSidebar({ onHandleActive, activeTab, items }) {
  const btnClassName =
    "w-full flex items-center gap-3 px-4 py-3 cursor-pointer rounded-xl text-sm font-medium transition-all font-bold";

  return (
    <aside className="flex flex-col gap-10 md:w-64">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 bg-yellow-300 flex items-center justify-center rounded-2xl">
          <span className="text-zinc-950 font-black text-xl">D</span>
        </div>
        <div>
          <p className="uppercase text-white font-bold text-sm truncate">
            Daniel Kopáč
          </p>
          <p className="uppercase text-zinc-500 text-[10px] font-bold tracking-widest">
            Platinum member
          </p>
        </div>
      </div>

      {/* ACCOUNT MENU */}
      <nav className="flex flex-col gap-2">
        {items.map(({ name, label, icon: Icon }) => (
          <button
            key={name}
            className={`${btnClassName} ${activeTab === name ? "text-zinc-950 bg-accent pointer-events-none" : "hover:text-white hover:bg-zinc-900"} `}
            onClick={() => {
              onHandleActive(name);
            }}
          >
            <Icon size={20} aria-hidden="true" />
            <span>{label}</span>
          </button>
        ))}
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-all mt-8">
          <LogOut size={20} aria-hidden="true" />
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
}

export default AccountSidebar;
