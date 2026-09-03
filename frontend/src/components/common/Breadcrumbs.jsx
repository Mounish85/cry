import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumbs = ({ items = [] }) => {
  return (
    <nav className="flex items-center space-x-2 text-xs text-slate-400 mb-6 overflow-x-auto py-1">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-1 hover:text-slate-200 transition-colors shrink-0"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Dashboard</span>
      </Link>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div key={index} className="flex items-center space-x-2 shrink-0">
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            {item.href && !isLast ? (
              <Link
                to={item.href}
                className="hover:text-slate-200 transition-colors font-medium"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-slate-200 font-semibold truncate max-w-[200px] sm:max-w-xs">
                {item.label}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
};

