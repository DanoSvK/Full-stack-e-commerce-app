function Hero() {
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
      <p className="[animation-delay:200ms] [animation-fill-mode:backwards] animate-push-up max-w-2xl text-center text-zinc-400 text-lg md:text-xl mx-auto leading-relaxed">
        A modular dark-mode e-commerce platform designed for testing advanced
        personalization, weblayers, and catalog management.
      </p>
    </article>
  );
}

export default Hero;
