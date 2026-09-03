export const ScoreMeter = ({ score = 0, level = 'LOW', showLabel = true }) => {
  const percentage = Math.min(Math.max(score, 0), 100);

  const getColorClass = () => {
    if (level === 'HIGH' || percentage >= 80) {
      return {
        bar: 'bg-gradient-to-r from-orange-500 to-red-500 shadow-glow-red',
        text: 'text-red-400',
        track: 'bg-red-950/40 border-red-900/40',
      };
    }
    if (level === 'MEDIUM' || percentage >= 50) {
      return {
        bar: 'bg-gradient-to-r from-yellow-500 to-amber-500 shadow-glow-amber',
        text: 'text-amber-400',
        track: 'bg-amber-950/40 border-amber-900/40',
      };
    }
    return {
      bar: 'bg-gradient-to-r from-teal-500 to-emerald-500',
      text: 'text-emerald-400',
      track: 'bg-emerald-950/40 border-emerald-900/40',
    };
  };

  const style = getColorClass();

  return (
    <div className="w-full space-y-1.5">
      {showLabel && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium">ML Attention Risk Score</span>
          <span className={`font-mono font-bold ${style.text}`}>{percentage} / 100</span>
        </div>
      )}
      <div className={`w-full h-2 rounded-full border overflow-hidden ${style.track}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ${style.bar}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

