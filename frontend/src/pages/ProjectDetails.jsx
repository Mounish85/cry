import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projectsAPI } from '../api/projects';
import { actionItemsAPI } from '../api/actionItems';
import { ActionItemCard } from '../components/actionItems/ActionItemCard';
import { StatusUpdateModal } from '../components/actionItems/StatusUpdateModal';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { ErrorBanner } from '../components/common/ErrorBanner';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { 
  FolderKanban, 
  Building2, 
  User, 
  Calendar, 
  Clock, 
  CheckSquare, 
  ArrowLeft,
  ShieldAlert,
  AlertCircle
} from 'lucide-react';

export const ProjectDetails = () => {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [projectActions, setProjectActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedItemForStatus, setSelectedItemForStatus] = useState(null);

  const fetchProjectData = async () => {
    setLoading(true);
    setError('');

    try {
      const [projData, actionsData] = await Promise.all([
        projectsAPI.getById(id),
        actionItemsAPI.getAll(),
      ]);

      setProject(projData.project);

      // Filter action items belonging to this project
      const items = (actionsData.actionItems || []).filter(
        (item) => item.projectId?._id === id || item.projectId === id
      );
      setProjectActions(items);
    } catch (err) {
      console.error('Project details fetch error:', err);
      setError(err.response?.data?.message || 'Failed to load project details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Not set';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleStatusUpdated = (updatedItem) => {
    setProjectActions((prev) =>
      prev.map((item) => (item._id === updatedItem._id ? { ...item, ...updatedItem } : item))
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Breadcrumbs items={[{ label: 'Projects', href: '/projects' }, { label: 'Loading...' }]} />
        <div className="h-44 glass-card rounded-2xl animate-pulse" />
        <LoadingSkeleton count={3} />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="space-y-6">
        <Breadcrumbs items={[{ label: 'Projects', href: '/projects' }, { label: 'Error' }]} />
        <ErrorBanner message={error || 'Project not found'} onRetry={fetchProjectData} />
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 hover:text-blue-300"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects</span>
        </Link>
      </div>
    );
  }

  const highAttentionCount = projectActions.filter((i) => i.attentionLevel === 'HIGH').length;
  const pendingCount = projectActions.filter((i) => i.status === 'PENDING').length;
  const completedCount = projectActions.filter((i) => i.status === 'COMPLETED').length;

  return (
    <div className="space-y-8">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Projects', href: '/projects' },
          { label: project.name },
        ]}
      />

      {/* Project Banner Card */}
      <div className="glass-card rounded-3xl p-8 border border-slate-800 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30 shadow-sm">
                {project.cycle} Implementation Cycle
              </span>
              <span className="text-xs font-mono text-slate-500">
                Project Ref #{project._id}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {project.name}
            </h1>
          </div>

          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors self-start md:self-auto"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Projects</span>
          </Link>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 text-xs">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-slate-500 font-medium block">Partner NGO</span>
              <span className="text-sm font-semibold text-slate-200 mt-0.5 block">
                {project.ngoId?.name || 'NGO Partner'}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div>
              <span className="text-slate-500 font-medium block">Frontliner / Lead</span>
              <span className="text-sm font-semibold text-slate-200 mt-0.5 block truncate">
                {project.frontlinerId?.name || project.frontlinerId?.email || 'Assigned Lead'}
              </span>
              {project.frontlinerId?.email && (
                <span className="text-[11px] text-slate-400 block truncate">
                  {project.frontlinerId.email}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <span className="text-slate-500 font-medium block">Timeline</span>
              <span className="text-sm font-semibold text-slate-200 mt-0.5 block">
                {formatDate(project.startDate)}
              </span>
              <span className="text-[11px] text-slate-400 block">
                to {formatDate(project.endDate)}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-slate-500 font-medium block">Milestone Status</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-semibold text-slate-200">
                  {completedCount}/{projectActions.length} Completed
                </span>
                {highAttentionCount > 0 && (
                  <span className="px-1.5 py-0.2 text-[10px] font-bold rounded bg-red-500/20 text-red-400 border border-red-500/30">
                    {highAttentionCount} Urgent
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Linked Action Items Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-2">
          <div className="flex items-center gap-2.5">
            <CheckSquare className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-bold text-white">Project Action Items</h2>
            <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-slate-800 text-slate-300">
              {projectActions.length}
            </span>
          </div>
        </div>

        {projectActions.length === 0 ? (
          <div className="glass-card rounded-2xl p-10 text-center border border-slate-800">
            <CheckSquare className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-300">No action items linked to this project</p>
            <p className="text-xs text-slate-500 mt-1">
              All compliance items are tracked in the central Action Items registry.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectActions.map((item) => (
              <ActionItemCard
                key={item._id}
                item={item}
                onUpdateStatus={() => setSelectedItemForStatus(item)}
              />
            ))}
          </div>
        )}
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

