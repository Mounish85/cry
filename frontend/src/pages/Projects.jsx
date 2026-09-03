import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectsAPI } from '../api/projects';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorBanner } from '../components/common/ErrorBanner';
import { 
  FolderKanban, 
  Search, 
  Building2, 
  User, 
  Calendar, 
  ArrowRight, 
  LayoutGrid, 
  List, 
  Clock,
  Filter
} from 'lucide-react';

export const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [cycleFilter, setCycleFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  const fetchProjects = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await projectsAPI.getAll();
      setProjects(data.projects || []);
    } catch (err) {
      console.error('Projects fetch error:', err);
      setError(err.response?.data?.message || 'Failed to load projects. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Not set';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Filter projects based on search query and cycle
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.ngoId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.frontlinerId?.name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCycle = cycleFilter === 'ALL' || p.cycle === cycleFilter;

    return matchesSearch && matchesCycle;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <FolderKanban className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Projects Directory
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Track child rights initiatives, partner NGO assignments, and implementation timelines.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                viewMode === 'grid'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Grid View"
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

      {error && <ErrorBanner message={error} onRetry={fetchProjects} />}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search by project, NGO, or coordinator..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full glass-input rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-slate-500"
          />
        </div>

        {/* Cycle Filter Pills */}
        <div className="flex items-center gap-2 self-start sm:self-auto overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <span className="text-xs text-slate-500 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span>Cycle:</span>
          </span>
          {['ALL', 'JAN', 'JULY'].map((cycle) => (
            <button
              key={cycle}
              onClick={() => setCycleFilter(cycle)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                cycleFilter === cycle
                  ? 'bg-blue-600/25 text-blue-400 border border-blue-500/40 shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cycle === 'ALL' ? 'All Cycles' : `${cycle} Cycle`}
            </button>
          ))}
        </div>
      </div>

      {/* Content Rendering */}
      {loading ? (
        <LoadingSkeleton count={3} type={viewMode === 'table' ? 'table' : 'card'} />
      ) : filteredProjects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects found"
          description={
            searchQuery || cycleFilter !== 'ALL'
              ? 'No projects match your current search and filter settings.'
              : 'There are currently no projects registered in the monitoring system.'
          }
          actionText={searchQuery || cycleFilter !== 'ALL' ? 'Reset Filters' : undefined}
          onAction={() => {
            setSearchQuery('');
            setCycleFilter('ALL');
          }}
        />
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((proj) => (
            <div
              key={proj._id}
              className="glass-card glass-card-hover rounded-2xl p-6 flex flex-col justify-between border border-slate-800 relative overflow-hidden"
            >
              <div>
                {/* Header Tag */}
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/25">
                    {proj.cycle} Cycle
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    ID: {proj._id.substring(proj._id.length - 6)}
                  </span>
                </div>

                {/* Name */}
                <Link
                  to={`/projects/${proj._id}`}
                  className="text-base font-bold text-white hover:text-blue-400 transition-colors block mb-4"
                >
                  {proj.name}
                </Link>

                {/* Details */}
                <div className="space-y-2.5 text-xs text-slate-400">
                  <div className="flex items-center gap-2.5">
                    <Building2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="text-slate-200 font-medium truncate">
                      {proj.ngoId?.name || 'Partner NGO'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <User className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span className="truncate">
                      Frontliner: {proj.frontlinerId?.name || proj.frontlinerId?.email || 'Assigned'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 pt-1">
                    <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
                    <span className="text-[11px]">
                      {formatDate(proj.startDate)} — {formatDate(proj.endDate)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Link */}
              <div className="pt-5 border-t border-slate-800/80 mt-6 flex items-center justify-end">
                <Link
                  to={`/projects/${proj._id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <span>Project Overview & Action Items</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Project Name</th>
                  <th className="px-5 py-3.5">Partner NGO</th>
                  <th className="px-5 py-3.5">Frontliner</th>
                  <th className="px-5 py-3.5">Cycle</th>
                  <th className="px-5 py-3.5">Timeline</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredProjects.map((proj) => (
                  <tr
                    key={proj._id}
                    className="hover:bg-slate-800/30 transition-colors group"
                  >
                    <td className="px-5 py-4 font-semibold text-white">
                      <Link
                        to={`/projects/${proj._id}`}
                        className="hover:text-blue-400 transition-colors"
                      >
                        {proj.name}
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-slate-300">
                      {proj.ngoId?.name || 'NGO Partner'}
                    </td>
                    <td className="px-5 py-4 text-slate-400">
                      {proj.frontlinerId?.name || proj.frontlinerId?.email || 'Coordinator'}
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/25">
                        {proj.cycle}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-400 text-[11px]">
                      {formatDate(proj.startDate)} → {formatDate(proj.endDate)}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        to={`/projects/${proj._id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300"
                      >
                        <span>View</span>
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
    </div>
  );
};

