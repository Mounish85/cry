import { useState } from 'react';
import { actionItemsAPI } from '../../api/actionItems';
import { X, CheckCircle2, Clock, AlertTriangle, Loader2 } from 'lucide-react';

export const StatusUpdateModal = ({ item, isOpen, onClose, onUpdated }) => {
  const [selectedStatus, setSelectedStatus] = useState(item?.status || 'PENDING');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !item) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await actionItemsAPI.update(item._id, {
        status: selectedStatus,
      });
      if (onUpdated) {
        onUpdated(response.actionItem || { ...item, status: selectedStatus });
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update action item status');
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    {
      value: 'PENDING',
      label: 'Pending',
      description: 'Work is currently in progress or waiting on action',
      icon: Clock,
      color: 'border-sky-500/30 text-sky-400 bg-sky-500/10',
    },
    {
      value: 'COMPLETED',
      label: 'Completed',
      description: 'Deliverables verified and task fulfilled',
      icon: CheckCircle2,
      color: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
    },
    {
      value: 'OVERDUE',
      label: 'Overdue',
      description: 'Deadline passed without completion; requires urgent attention',
      icon: AlertTriangle,
      color: 'border-rose-500/30 text-rose-400 bg-rose-500/10',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-[#0f172a] border border-slate-700/80 rounded-2xl p-6 shadow-2xl z-10">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white">Update Action Item Status</h3>
            <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{item.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white bg-slate-800/80"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400">
            {error}
          </div>
        )}

        {/* Options */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          {statusOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = selectedStatus === opt.value;
            return (
              <label
                key={opt.value}
                onClick={() => setSelectedStatus(opt.value)}
                className={`flex items-start gap-3.5 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? `${opt.color} ring-1 ring-blue-500/50`
                    : 'border-slate-800 bg-slate-900/50 hover:bg-slate-800/50 text-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value={opt.value}
                  checked={isSelected}
                  onChange={() => setSelectedStatus(opt.value)}
                  className="sr-only"
                />
                <Icon className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white">{opt.label}</span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{opt.description}</p>
                </div>
              </label>
            );
          })}

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-800 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-glow-blue disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Save Status</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

