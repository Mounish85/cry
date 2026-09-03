export const LoadingSkeleton = ({ count = 3, type = 'card' }) => {
  if (type === 'table') {
    return (
      <div className="space-y-3 w-full animate-pulse">
        <div className="h-10 bg-slate-800/60 rounded-lg w-full" />
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="h-16 bg-slate-800/40 rounded-lg w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="glass-card p-6 rounded-2xl animate-pulse space-y-4 border border-slate-800"
        >
          <div className="flex justify-between items-start">
            <div className="h-5 bg-slate-700/60 rounded w-2/3" />
            <div className="h-6 bg-slate-700/60 rounded-full w-20" />
          </div>
          <div className="space-y-2 pt-2">
            <div className="h-4 bg-slate-800/80 rounded w-5/6" />
            <div className="h-4 bg-slate-800/80 rounded w-1/2" />
          </div>
          <div className="pt-4 border-t border-slate-800/60 flex justify-between items-center">
            <div className="h-4 bg-slate-800/60 rounded w-24" />
            <div className="h-8 bg-slate-800/80 rounded-lg w-24" />
          </div>
        </div>
      ))}
    </div>
  );
};

