import { ShieldAlert, ShieldCheck, AlertCircle } from 'lucide-react';

export const AttentionBadge = ({ level, score, showScore = true, size = 'md' }) => {
  const normalized = level ? level.toUpperCase() : 'LOW';

  const config = {
    HIGH: {
      label: 'High Attention',
      bg: 'bg-red-500/15 text-red-400 border-red-500/35 shadow-glow-red',
      pulse: 'bg-red-400',
      icon: ShieldAlert,
    },
    MEDIUM: {
      label: 'Medium Attention',
      bg: 'bg-amber-500/15 text-amber-400 border-amber-500/35 shadow-glow-amber',
      pulse: 'bg-amber-400',
      icon: AlertCircle,
    },
    LOW: {
      label: 'Low Attention',
      bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      pulse: 'bg-emerald-400',
      icon: ShieldCheck,
    },
  }[normalized] || {
    label: normalized,
    bg: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
    pulse: 'bg-slate-400',
    icon: ShieldCheck,
  };

  const Icon = config.icon;
  const sizeClasses = size === 'sm'
    ? 'px-2 py-0.5 text-xs gap-1'
    : size === 'lg'
    ? 'px-3.5 py-1.5 text-sm gap-2'
    : 'px-2.5 py-1 text-xs gap-1.5';

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border backdrop-blur-xs transition-all ${config.bg} ${sizeClasses}`}
    >
      <span className="relative flex h-2 w-2">
        {normalized === 'HIGH' && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${config.pulse}`}></span>
      </span>
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{config.label}</span>
      {showScore && score !== undefined && score !== null && (
        <span className="ml-1 px-1.5 py-0.2 text-[10px] font-mono font-bold rounded bg-white/10 border border-white/15">
          {score}
        </span>
      )}
    </span>
  );
};

