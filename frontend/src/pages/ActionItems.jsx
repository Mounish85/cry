import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { actionItemsAPI } from '../api/actionItems';
import { ActionItemCard } from '../components/actionItems/ActionItemCard';
import { StatusUpdateModal } from '../components/actionItems/StatusUpdateModal';
import { StatusBadge } from '../components/common/StatusBadge';
import { AttentionBadge } from '../components/common/AttentionBadge';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorBanner } from '../components/common/ErrorBanner';
import { 
  CheckSquare, 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  ShieldAlert, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const ActionItems = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [actionItems, setActionItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'ALL');
  const [attentionFilter, setAttentionFilter] = useState(searchParams.get('attention') || 'ALL');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  const [selectedItemForStatus, setSelectedItemForStatus] = useState(null);

  const fetchActionItems = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await actionItemsAPI.getAll();
      setActionItems(data.actionItems || []);
    } catch (err) {
      console.error('Action items fetch error:', err);
      setError(err.response?.data?.message || 'Failed to load action items.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActionItems();
  }, []);

  // Sync URL params if provided
  useEffect(() => {
    const statusParam = searchParams.get('status');
    const attentionParam = searchParams.get('attention');
    if (statusParam) setStatusFilter(statusParam);
    if (attentionParam) setAttentionFilter(attentionParam);
  }, [searchParams]);

  const handleStatusUpdated = (updatedItem) => {
    setActionItems((prev) =>
      prev.map((item) => (item._id === updatedItem._id ? { ...item, ...updatedItem } : item))
    );
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Not set';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Filter items
  const filteredItems = actionItems.filter((item) => {
    const matchesSearch =
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.projectId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.assignedTo?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.assignedTo?.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    const matchesAttention = attentionFilter === 'ALL' || item.attentionLevel === attentionFilter;

    return matchesSearch && matchesStatus && matchesAttention;
  });

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setAttentionFilter('ALL');
    setSearchParams({});
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <CheckSquare className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Action Items & Milestones
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Track operational milestones with real-time empirical ML risk assessment.
          </p>
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                viewMode === 'grid'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                viewMode === 'table'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {error && <ErrorBanner message={error} onRetry={fetchActionItems} />}

      {/* Filter and Search Controls */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search by action item, project, or member..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full glass-input rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-slate-500"
            />
          </div>

          {/* Quick Filter Counts / Active Filters */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Attention Filter Selector */}
            <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs">
              <span className="text-[11px] text-slate-500 px-2 font-medium">Attention:</span>
              {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((level) => (
                <button
                  key={level}
                  onClick={() => {
                    setAttentionFilter(level);
                    const p = new URLSearchParams(searchParams);
                    if (level === 'ALL') p.delete('attention');
                    else p.set('attention', level);
                    setSearchParams(p);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    attentionFilter === level
                      ? level === 'HIGH'
                        ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                        : level === 'MEDIUM'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : level === 'LOW'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {level === 'ALL' ? 'All' : level}
                </button>
              ))}
            </div>

            {/* Status Filter Selector */}
            <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs">
              <span className="text-[11px] text-slate-500 px-2 font-medium">Status:</span>
              {['ALL', 'PENDING', 'OVERDUE', 'COMPLETED'].map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setStatusFilter(status);
                    const p = new URLSearchParams(searchParams);
                    if (status === 'ALL') p.delete('status');
                    else p.set('status', status);
                    setSearchParams(p);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    statusFilter === status
                      ? status === 'OVERDUE'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : status === 'COMPLETED'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : status === 'PENDING'
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                        : 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {status === 'ALL' ? 'All' : status}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Items List / Cards */}
      {loading ? (
        <LoadingSkeleton count={3} type={viewMode === 'table' ? 'table' : 'card'} />
      ) : filteredItems.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="No action items match criteria"
          description={
            searchQuery || statusFilter !== 'ALL' || attentionFilter !== 'ALL'
              ? 'Try modifying your search keywords or resetting the attention and status filters.'
              : 'There are currently no action items recorded in the system.'
          }
          actionText={
            searchQuery || statusFilter !== 'ALL' || attentionFilter !== 'ALL'
              ? 'Reset All Filters'
              : undefined
          }
          onAction={resetFilters}
        />
      ) : viewMode === 'grid' ? (
        /* Grid Layout */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <ActionItemCard
              key={item._id}
              item={item}
              onUpdateStatus={() => setSelectedItemForStatus(item)}
            />
          ))}
        </div>
      ) : (
        /* Table Layout */
        <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Action Item</th>
                  <th className="px-5 py-3.5">Project</th>
                  <th className="px-5 py-3.5">Assigned Lead</th>
                  <th className="px-5 py-3.5">Due Date</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">ML Attention</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredItems.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-4">
                      <Link
                        to={`/action-items/${item._id}`}
                        className="font-semibold text-white hover:text-blue-400 transition-colors block max-w-xs truncate"
                      >
                        {item.title}
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-slate-300">
                      {item.projectId?.name || 'Project'}
                    </td>
                    <td className="px-5 py-4 text-slate-400">
                      {item.assignedTo?.name || item.assignedTo?.email || 'Assigned'}
                    </td>
                    <td className="px-5 py-4 text-slate-400 text-[11px]">
                      {formatDate(item.dueDate)}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={item.status} size="sm" />
                    </td>
                    <td className="px-5 py-4">
                      <AttentionBadge
                        level={item.attentionLevel || 'LOW'}
                        score={item.attentionScore}
                        size="sm"
                      />
                    </td>
                    <td className="px-5 py-4 text-right space-x-2">
                      <button
                        onClick={() => setSelectedItemForStatus(item)}
                        className="px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700"
                      >
                        Status
                      </button>
                      <Link
                        to={`/action-items/${item._id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300"
                      >
                        <span>Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Quick Status Update Modal */}
      {selectedItemForStatus && (
        <StatusUpdateModal
          item={selectedItemForStatus}
          isOpen={Boolean(selectedItemForStatus)}
          onClose={() => setSelectedItemForStatus(null)}
          onUpdated={handleStatusUpdated}
        />
      )}
    </div>
  );
};

