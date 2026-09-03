import { Link } from 'react-router-dom';
import { StatusBadge } from '../common/StatusBadge';
import { AttentionBadge } from '../common/AttentionBadge';
import { ScoreMeter } from '../common/ScoreMeter';
import { Calendar, User, FolderKanban, ArrowRight, FileText, CheckCircle2 } from 'lucide-react';

export const ActionItemCard = ({ item, onUpdateStatus }) => {
  // Compute days remaining
  const calculateDaysRemaining = (dueDateStr) => {
    if (!dueDateStr) return null;
    const due = new Date(dueDateStr);
    const today = new Date();
    const diff = due - today;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const daysRemaining = calculateDaysRemaining(item.dueDate);
  const isOverdue = daysRemaining !== null && daysRemaining < 0 && item.status !== 'COMPLETED';

  // Format date nicely
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Not set';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className={`glass-card glass-card-hover rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden border ${
      item.attentionLevel === 'HIGH' ? 'border-red-500/30' : 'border-slate-800'
    }`}>
      {/* Top badges */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <StatusBadge status={item.status} size="sm" />
          <AttentionBadge
            level={item.attentionLevel || 'LOW'}
            score={item.attentionScore}
            size="sm"
          />
        </div>

        {/* Title */}
        <Link
          to={`/action-items/${item._id}`}
          className="text-base font-semibold text-slate-100 hover:text-blue-400 transition-colors line-clamp-2 mb-3 block"
        >
          {item.title}
        </Link>

        {/* Meta details */}
        <div className="space-y-2 text-xs text-slate-400 mb-4">
          {/* Project */}
          <div className="flex items-center gap-2">
            <FolderKanban className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="truncate">
              {item.projectId?.name || 'Project Reference'}
            </span>
          </div>

          {/* Assigned User */}
          <div className="flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="truncate">
              {item.assignedTo?.name || item.assignedTo?.email || 'Assigned Member'}
            </span>
          </div>

          {/* Due date & countdown */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Due: {formatDate(item.dueDate)}</span>
            </div>
            {daysRemaining !== null && item.status !== 'COMPLETED' && (
              <span
                className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                  isOverdue
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : daysRemaining <= 3
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                {isOverdue
                  ? `${Math.abs(daysRemaining)}d Overdue`
                  : `${daysRemaining}d left`}
              </span>
            )}
          </div>
        </div>

        {/* ML Score meter */}
        {item.attentionScore !== undefined && (
          <div className="pt-2 pb-4">
            <ScoreMeter
              score={item.attentionScore}
              level={item.attentionLevel}
              showLabel={true}
            />
          </div>
        )}
      </div>

      {/* Footer controls */}
      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2 mt-auto">
        {onUpdateStatus && (
          <button
            onClick={() => onUpdateStatus(item)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/70 hover:bg-slate-700 px-3 py-1.5 rounded-xl border border-slate-700 transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
            <span>Update Status</span>
          </button>
        )}

        <Link
          to={`/action-items/${item._id}`}
          className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors py-1.5"
        >
          <span>Details & Docs</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

