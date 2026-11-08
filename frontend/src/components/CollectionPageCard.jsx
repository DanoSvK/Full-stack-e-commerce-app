import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

function CollectionPageCard({
  kicker,
  title,
  description,
  image,
  stats,
  to,
  Icon,
  sublinks,
  order,
}) {
  return (
    <article className="glass-card rounded-3xl p-6 sm:p-10 border border-white/5 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
      <div
        className={`lg:col-span-5 grid gap-4 place-items-center lg:${order}`}
      >
        <img
          src={image}
          alt="product-icon"
          className="aspect-4/3 rounded-2xl overflow-hidden bg-zinc-900 border border-white/5"
        />
      </div>

      <div className="lg:col-span-7 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
            <Icon size={20} />
          </div>
          <span className="text-accent text-xs font-bold uppercase tracking-widest">
            {kicker}
          </span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-header">
          {title}{" "}
        </h2>
        <p className="text-main text-sm sm:text-base leading-relaxed">
          {description}
        </p>
        <p className="text-xs text-zinc-400 font-medium">{stats}</p>
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link
            to={to}
            className="btn-primary inline-flex items-center gap-2 text-sm"
          >
            <span>Explore Collections</span>
            <ArrowRight size={20} />
          </Link>
          {sublinks.map((sublink) => {
            <Link to={sublink.to} className="btn-secondary text-xs py-3 px-4">
              {sublink.label}
            </Link>;
          })}
        </div>
      </div>
    </article>
  );
}

export default CollectionPageCard;
