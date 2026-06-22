import Logo from "./Logo";

function Footer() {
  return (
    <footer className="mt-24 border-t border-white/5">
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-12 flex flex-col md:flex-row md:justify-between items-center gap-6 text-center">
        <Logo />
        <article className="space-y-6 md:space-y-0 md:flex md:flex-row text-zinc-600 text-xs gap-8">
          <p>© 2026 BESTshop Demo. All rights reserved.</p>
          <p className="space-x-8">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </p>
        </article>
      </section>
    </footer>
  );
}

export default Footer;
