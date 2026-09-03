import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { projectsAPI } from '../api/projects';
import { actionItemsAPI } from '../api/actionItems';
import { notificationsAPI } from '../api/notifications';
import { ActionItemCard } from '../components/actionItems/ActionItemCard';
import { StatusUpdateModal } from '../components/actionItems/StatusUpdateModal';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { ErrorBanner } from '../components/common/ErrorBanner';
import { 
  FolderKanban, 
  CheckSquare, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  AlertCircle, 
  Bell, 
  ArrowRight, 
  Calendar, 
  Building2,
  Sparkles
} from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuth();

  const [projects, setProjects] = useState([]);
  const [actionItems, setActionItems] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedItemForStatus, setSelectedItemForStatus] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');

    try {
      const [projRes, actionRes, notifRes] = await Promise.allSettled([
        projectsAPI.getAll(),
        actionItemsAPI.getAll(),
        notificationsAPI.getAll(),
      ]);

      if (projRes.status === 'fulfilled') {
        setProjects(projRes.value.projects || []);
      }
      if (actionRes.status === 'fulfilled') {
        setActionItems(actionRes.value.actionItems || []);
      }
      if (notifRes.status === 'fulfilled') {
        setNotifications(notifRes.value.notifications || []);
      }

      // Check if critical calls failed
      if (actionRes.status === 'rejected' && projRes.status === 'rejected') {
        setError('Failed to load dashboard data. Please verify your connection.');
      }
    } catch (err) {
      setError('An unexpected error occurred while fetching dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleStatusUpdated = (updatedItem) => {
    setActionItems((prev) =>
      prev.map((item) => (item._id === updatedItem._id ? { ...item, ...updatedItem } : item))
    );
  };

  // Metrics derived purely from backend data
  const totalProjects = projects.length;
  const pendingItems = actionItems.filter((i) => i.status === 'PENDING').length;
  const completedItems = actionItems.filter((i) => i.status === 'COMPLETED').length;
  const overdueItems = actionItems.filter((i) => i.status === 'OVERDUE').length;

  const highAttentionItems = actionItems.filter((i) => i.attentionLevel === 'HIGH');
  const mediumAttentionItems = actionItems.filter((i) => i.attentionLevel === 'MEDIUM');
  const unreadNotifications = notifications.filter((n) => !n.read).length;

  // Urgent items needing action (High attention or overdue)
  const urgentItems = actionItems
    .filter((i) => i.attentionLevel === 'HIGH' || i.status === 'OVERDUE')
    .slice(0, 3);

  const statCards = [
    {
      label: 'Active Projects',
      value: totalProjects,
      sub: 'Child Welfare Tracks',
      icon: FolderKanban,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/20',
      link: '/projects',
    },
    {
      label: 'Pending Actions',
      value: pendingItems,
      sub: 'Awaiting Fulfillment',
      icon: Clock,
      color: 'text-sky-400',
      bg: 'bg-sky-500/10 border-sky-500/20',
      link: '/action-items?status=PENDING',
    },
    {
      label: 'Overdue Items',
      value: overdueItems,
      sub: 'Passed Deadline',
      icon: AlertTriangle,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10 border-rose-500/20',
      link: '/action-items?status=OVERDUE',
    },
    {
      label: 'Completed Items',
      value: completedItems,
      sub: 'Verified Deliverables',
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
      link: '/action-items?status=COMPLETED',
    },
    {
      label: 'High Attention Alerts',
      value: highAttentionItems.length,
      sub: 'ML Risk Classification',
      icon: ShieldAlert,
      color: 'text-red-400',
      bg: 'bg-red-500/15 border-red-500/30',
      link: '/action-items?attention=HIGH',
    },
    {
      label: 'Medium Attention',
      value: mediumAttentionItems.length,
      sub: 'Upcoming Deadlines',
      icon: AlertCircle,
      color: 'text-amber-400',
      bg: 'bg-amber-500/15 border-amber-500/30',
      link: '/action-items?attention=MEDIUM',
    },
  ];

  return (
    <div className="space-y-10">
      {/* Welcome & Overview Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Monitoring Dashboard
            </h1>
            <span className="px-2.5 py-0.5 text-[11px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30 rounded-full">
              Live Sync
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Logged in as <strong className="text-slate-200">{user?.name}</strong>{' '}
            {user?.role && (
              <span className="text-blue-400 font-medium capitalize">
                ({user.role.toLowerCase().replace('_', ' ')})
              </span>
            )}
            . Review project deliverables and ML attention scores.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/action-items"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-glow-blue transition-all"
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>View All Action Items</span>
          </Link>
        </div>
      </div>

      {error && <ErrorBanner message={error} onRetry={fetchDashboardData} />}

      {/* High Attention ML Warning Alert if any items exist */}
      {highAttentionItems.length > 0 && (
        <div className="glass-card rounded-2xl p-5 border border-red-500/35 bg-red-500/5 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-glow-red">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>{highAttentionItems.length} High-Risk Action Item{highAttentionItems.length > 1 ? 's' : ''} Detected</span>
                <span className="px-2 py-0.2 text-[10px] uppercase font-bold rounded bg-red-500/30 text-red-300">
                  ML Model Alert
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Our machine learning empirical model has flagged milestone items with imminent deadlines or overdue progress.
              </p>
            </div>
          </div>
          <Link
            to="/action-items?attention=HIGH"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-red-300 hover:text-white bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-xl transition-colors shrink-0"
          >
            <span>Review Urgent Items</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Stats Counter Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Link
              key={i}
              to={stat.link}
              className={`glass-card glass-card-hover rounded-2xl p-4 border transition-all flex flex-col justify-between ${stat.bg}`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-400 truncate">
                  {stat.label}
                </span>
                <Icon className={`w-4 h-4 ${stat.color} shrink-0`} />
              </div>
              <div>
                <span className={`text-2xl font-extrabold ${stat.color}`}>
                  {loading ? '—' : stat.value}
                </span>
                <p className="text-[10px] text-slate-500 mt-0.5 truncate">{stat.sub}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Main Dashboard Split: Urgent Actions & Recent Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2 Cols): Urgent Attention Action Items */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h2 className="text-lg font-bold text-white">Priority Action Items</h2>
            </div>
            <Link
              to="/action-items"
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
            >
              <span>Explore All ({actionItems.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <LoadingSkeleton count={2} />
          ) : urgentItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {urgentItems.map((item) => (
                <ActionItemCard
                  key={item._id}
                  item={item}
                  onUpdateStatus={() => setSelectedItemForStatus(item)}
                />
              ))}
            </div>
          ) : actionItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {actionItems.slice(0, 2).map((item) => (
                <ActionItemCard
                  key={item._id}
                  item={item}
                  onUpdateStatus={() => setSelectedItemForStatus(item)}
                />
              ))}
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-8 text-center border border-slate-800">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-200">All caught up!</p>
              <p className="text-xs text-slate-400 mt-1">No action items are pending attention.</p>
            </div>
          )}

          {/* Quick Shortcuts */}
          <div className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Need to verify field records?</p>
                <p className="text-[11px] text-slate-400">Attach and inspect verification documents on action items.</p>
              </div>
            </div>
            <Link
              to="/action-items"
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors"
            >
              Upload Documents
            </Link>
          </div>
        </div>

        {/* Right Column (1 Col): Projects Summary & Recent Notifications */}
        <div className="space-y-6">
          
          {/* Projects Card */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold text-white">Active Projects</h3>
              </div>
              <Link
                to="/projects"
                className="text-[11px] font-semibold text-blue-400 hover:text-blue-300"
              >
                View Directory
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-12 bg-slate-800/40 rounded-xl" />
                <div className="h-12 bg-slate-800/40 rounded-xl" />
              </div>
            ) : projects.length > 0 ? (
              <div className="space-y-3">
                {projects.slice(0, 3).map((proj) => (
                  <Link
                    key={proj._id}
                    to={`/projects/${proj._id}`}
                    className="block p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/30 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-200 group-hover:text-blue-400 transition-colors truncate">
                        {proj.name}
                      </span>
                      <span className="px-2 py-0.2 text-[10px] font-bold rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
                        {proj.cycle} Cycle
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1.5">
                      <Building2 className="w-3 h-3 text-slate-500" />
                      <span className="truncate">{proj.ngoId?.name || 'NGO Partner'}</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-4 text-center">No projects registered yet.</p>
            )}
          </div>

          {/* Recent Notifications Card */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Recent Alerts</h3>
                {unreadNotifications > 0 && (
                  <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-red-500 text-white">
                    {unreadNotifications}
                  </span>
                )}
              </div>
              <Link
                to="/notifications"
                className="text-[11px] font-semibold text-blue-400 hover:text-blue-300"
              >
                All Alerts
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-10 bg-slate-800/40 rounded-xl" />
              </div>
            ) : notifications.length > 0 ? (
              <div className="space-y-2.5">
                {notifications.slice(0, 3).map((notif) => (
                  <div
                    key={notif._id}
                    className={`p-3 rounded-xl border text-xs transition-all ${
                      !notif.read
                        ? 'bg-blue-500/10 border-blue-500/30 text-slate-200'
                        : 'bg-slate-900/40 border-slate-800 text-slate-400'
                    }`}
                  >
                    <p className="line-clamp-2 leading-relaxed">{notif.message}</p>
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      {new Date(notif.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-4 text-center">No notifications found.</p>
            )}
          </div>

        </div>

      </div>

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

