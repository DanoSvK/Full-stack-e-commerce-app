import { ChevronDown } from "lucide-react";

function Hero() {
  function scrollToCards() {
    document
      .getElementById("home-cards")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <article className="group animate-fade-in relative flex flex-col items-center min-h-[64vh] mt-40 gap-6 z-10">
      <div className="absolute -top-16 left-[10%] w-64 h-64 md:w-96 md:h-96 bg-accent/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute -top-16 right-0 -translate-x-1/2 w-64 h-64 md:w-96 md:h-96 bg-blue-700/15 rounded-full blur-[120px] animate-pulse delay-700" />
      <header className="animate-scale-up inline-block px-4 py-1.5 rounded-full bg-zinc-900/50 border border-white/10 text-xs font-bold tracking-widest text-accent uppercase">
        The Ultimate Demo E-Shop
      </header>
      <h1 className="animate-push-up text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-accent">
        LIMITLESS
      </h1>
      <p className="[animation-delay:200ms] [animation-fill-mode:backwards] animate-push-up max-w-2xl text-center text-title text-lg md:text-xl mx-auto leading-relaxed">
        A modular dark-mode e-commerce platform designed for testing advanced
        personalization, weblayers, and catalog management.
      </p>
      <button
        type="button"
        onClick={scrollToCards}
        aria-label="Scroll to page sections"
        className="mt-2 flex h-11 w-11 items-center justify-center rounded-full border border-accent/30 bg-zinc-900/50 text-accent shadow-[0_0_24px_rgba(255,222,33,0.12)] hover:border-accent hover:bg-accent/10 hover:text-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 cursor-pointer"
      >
        <ChevronDown
          className="h-5 w-5 animate-scroll-hint"
          aria-hidden="true"
          strokeWidth={2.25}
        />
      </button>
    </article>
  );
}

export default Hero;
