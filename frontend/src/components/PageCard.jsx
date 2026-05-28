import { Link } from "react-router-dom";

import { ArrowRight } from "lucide-react";

function PageCard({ content }) {
  const { icon: Icon, title, description, textColor, bgColor, to } = content;
  return (
    <Link to={to}>
      <div className="p-8 glass-card wrap rounded-3xl flex flex-col h-full group border border-zinc-800">
        <div
          className={`w-14 h-14 bg-blue-400/10 ${bgColor} flex justify-center items-center mb-6 rounded-2xl`}
        >
          <Icon className={`w-7 h-7 ${textColor}`} aria-hidden="true" />
        </div>
        <h3 className="text-white leading-relaxed text-2xl font-bold mb-3">
          {title}
        </h3>
        <p className="text-zinc-500 text-sm mb-6">{description}</p>
        <div className="mt-auto flex items-center text-accent text-sm font-bold group-hover:gap-2 ">
          <span>Get Started</span>
          <ArrowRight className="flex items-center text-accent text-sm font-bold" />
        </div>
      </div>
    </Link>
  );
}

export default PageCard;
