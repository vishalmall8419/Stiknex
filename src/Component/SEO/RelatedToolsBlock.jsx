import { Link } from "react-router-dom";
import { TIER1_RELATED_TOOLS } from "../../data/tier1RelatedTools";

const RelatedToolsBlock = ({ currentPath }) => {
  const links = TIER1_RELATED_TOOLS[currentPath];
  if (!links || links.length === 0) return null;

  return (
    <section
      aria-label="Related tools"
      className="w-full border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-950/80 px-4 sm:px-6 py-4"
    >
      <div className="max-w-6xl mx-auto flex flex-wrap items-center gap-2.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mr-1">
          Related tools:
        </span>
        {links.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RelatedToolsBlock;
