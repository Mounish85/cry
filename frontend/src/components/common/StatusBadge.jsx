import { Clock, CheckCircle2, AlertTriangle } from 'lucide-react';

export const StatusBadge = ({ status, size = 'md' }) => {
  const normalized = status ? status.toUpperCase() : 'PENDING';

  const config = {
    PENDING: {
      label: 'Pending',
      bg: 'bg-sky-500/10 text-sky-400 border-sky-500/25',
      icon: Clock,
      dot: 'bg-sky-400',
    },
    COMPLETED: {
      label: 'Completed',
      bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
      icon: CheckCircle2,
      dot: 'bg-emerald-400',
    },
    OVERDUE: {
      label: 'Overdue',
      bg: 'bg-rose-500/10 text-rose-400 border-rose-500/25',
      icon: AlertTriangle,
      dot: 'bg-rose-400 animate-pulse',
    },
  }[normalized] || {
    label: normalized,
    bg: 'bg-slate-500/10 text-slate-400 border-slate-500/25',
    icon: Clock,
    dot: 'bg-slate-400',
  };

  const Icon = config.icon;
  const sizeClasses = size === 'sm' 
    ? 'px-2 py-0.5 text-xs gap-1' 
    : size === 'lg' 
    ? 'px-3.5 py-1.5 text-sm gap-2' 
    : 'px-2.5 py-1 text-xs gap-1.5';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border backdrop-blur-xs transition-colors ${config.bg} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{config.label}</span>
    </span>
  );
};

