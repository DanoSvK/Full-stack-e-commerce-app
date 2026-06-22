import { Power } from "lucide-react";

function KillSwitch({ content, onKillSwitch, isActive }) {
  const { title, secondaryTitle, text, secondaryText, icon: Icon } = content;

  return (
    <div className="flex flex-col justify-between px-4 lg:px-0 gap-8 md:flex-row">
      <article className="max-w-xl">
        <header className="flex flex-row items-center gap-6 space-y-2">
          <Icon size={40} className="text-accent" aria-hidden="true" />
          <h1 className="text-4xl text-white font-black tracking-tighter uppercase">
            {title}
          </h1>
        </header>
        <p className="text-zinc-500 text-sm max-w-xl">{text}</p>
      </article>
      <section
        className={`flex text-right gap-6 p-6 rounded-4xl border ${isActive ? "bg-zinc-900 border-white/5" : "bg-red-500/10 border-red-500/30"}`}
      >
        <div className="space-y-1">
          <p className="text-white font-bold text-sm uppercase tracking-tight">
            {secondaryTitle}
          </p>
          <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">
            {secondaryText}
          </p>
        </div>
        <button
          type="button"
          aria-label="Toggle button"
          aria-pressed={isActive}
          className={`w-16 cursor-pointer h-8 rounded-full p-1 transition-all duration-300  flex justify-start ${isActive ? "bg-zinc-800" : "bg-red-500"}`}
          onClick={onKillSwitch}
        >
          <div
            className={`flex items-center justify-center w-6 h-6 bg-white rounded-full shadow transition-transform duration-300 ${isActive ? "translate-x-0" : "translate-x-8 text-red-500"}`}
          >
            <Power size={12} aria-hidden="false" />
          </div>
        </button>
      </section>
    </div>
  );
}

export default KillSwitch;
