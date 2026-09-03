import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { actionItemsAPI } from '../api/actionItems';
import { documentsAPI } from '../api/documents';
import { StatusBadge } from '../components/common/StatusBadge';
import { AttentionBadge } from '../components/common/AttentionBadge';
import { ScoreMeter } from '../components/common/ScoreMeter';
import { DocumentUpload } from '../components/documents/DocumentUpload';
import { DocumentList } from '../components/documents/DocumentList';
import { StatusUpdateModal } from '../components/actionItems/StatusUpdateModal';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { ErrorBanner } from '../components/common/ErrorBanner';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { 
  CheckSquare, 
  FolderKanban, 
  User, 
  Calendar, 
  Clock, 
  BrainCircuit, 
  FileText, 
  ShieldAlert, 
  ArrowLeft,
  CheckCircle2,
  FileCheck
} from 'lucide-react';

export const ActionItemDetails = () => {
  const { id } = useParams();

  const [item, setItem] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [docsLoading, setDocsLoading] = useState(true);
  const [error, setError] = useState('');

  const [statusModalOpen, setStatusModalOpen] = useState(false);

  const fetchActionItemAndDocs = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await actionItemsAPI.getById(id);
      setItem(data.actionItem);
      setAnalysis(data.analysis || {});
    } catch (err) {
      console.error('Action item fetch error:', err);
      setError(err.response?.data?.message || 'Failed to load action item details.');
    } finally {
      setLoading(false);
    }

    // Fetch documents
    setDocsLoading(true);
    try {
      const docsData = await documentsAPI.getByActionItemId(id);
      setDocuments(docsData.documents || []);
    } catch (err) {
      console.error('Documents fetch error:', err);
    } finally {
      setDocsLoading(false);
    }
  };

  useEffect(() => {
    fetchActionItemAndDocs();
  }, [id]);

  const handleDocumentUploaded = (newDoc) => {
    setDocuments((prev) => [newDoc, ...prev]);
  };

  const handleStatusUpdated = (updatedItem) => {
    setItem((prev) => ({ ...prev, ...updatedItem }));
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Not specified';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Compute days remaining
  const calculateDaysRemaining = (dueDateStr) => {
    if (!dueDateStr) return null;
    const due = new Date(dueDateStr);
    const today = new Date();
    const diff = due - today;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Breadcrumbs items={[{ label: 'Action Items', href: '/action-items' }, { label: 'Loading...' }]} />
        <div className="h-44 glass-card rounded-2xl animate-pulse" />
        <LoadingSkeleton count={2} />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="space-y-6">
        <Breadcrumbs items={[{ label: 'Action Items', href: '/action-items' }, { label: 'Error' }]} />
        <ErrorBanner message={error || 'Action item not found'} onRetry={fetchActionItemAndDocs} />
        <Link
          to="/action-items"
          className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 hover:text-blue-300"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Action Items</span>
        </Link>
      </div>
    );
  }

  const daysRemaining = calculateDaysRemaining(item.dueDate);
  const isOverdue = daysRemaining !== null && daysRemaining < 0 && item.status !== 'COMPLETED';

  return (
    <div className="space-y-8">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Action Items', href: '/action-items' },
          { label: item.title },
        ]}
      />

      {/* Main Header Banner */}
      <div className="glass-card rounded-3xl p-8 border border-slate-800 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <StatusBadge status={item.status} size="md" />
              <AttentionBadge
                level={analysis?.attentionLevel || 'LOW'}
                score={analysis?.attentionScore}
                size="md"
              />
              <span className="text-xs font-mono text-slate-500">
                Item Ref #{item._id}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug">
              {item.title}
            </h1>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setStatusModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-glow-blue transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Update Status</span>
            </button>
            <Link
              to="/action-items"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Back</span>
            </Link>
          </div>
        </div>

        {/* Metadata Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 text-xs">
          {/* Linked Project */}
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
              <FolderKanban className="w-4 h-4" />
            </div>
            <div>
              <span className="text-slate-500 font-medium block">Project Context</span>
              <Link
                to={item.projectId?._id ? `/projects/${item.projectId._id}` : '#'}
                className="text-sm font-semibold text-slate-200 hover:text-blue-400 transition-colors mt-0.5 block"
              >
                {item.projectId?.name || 'Project Reference'}
              </Link>
              {item.projectId?.cycle && (
                <span className="text-[11px] text-slate-400 block">
                  {item.projectId.cycle} Cycle
                </span>
              )}
            </div>
          </div>

          {/* Assigned User */}
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div>
              <span className="text-slate-500 font-medium block">Assigned Stakeholder</span>
              <span className="text-sm font-semibold text-slate-200 mt-0.5 block truncate">
                {item.assignedTo?.name || item.assignedTo?.email || 'Field Lead'}
              </span>
              {item.assignedTo?.email && (
                <span className="text-[11px] text-slate-400 block truncate">
                  {item.assignedTo.email}
                </span>
              )}
            </div>
          </div>

          {/* Due Date */}
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <span className="text-slate-500 font-medium block">Milestone Due Date</span>
              <span className="text-sm font-semibold text-slate-200 mt-0.5 block">
                {formatDate(item.dueDate)}
              </span>
              {daysRemaining !== null && item.status !== 'COMPLETED' && (
                <span
                  className={`text-[11px] font-semibold block mt-0.5 ${
                    isOverdue ? 'text-red-400' : 'text-amber-400'
                  }`}
                >
                  {isOverdue ? `${Math.abs(daysRemaining)} days overdue` : `${daysRemaining} days remaining`}
                </span>
              )}
            </div>
          </div>

          {/* Documents Count */}
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-slate-500 font-medium block">Verification Records</span>
              <span className="text-sm font-semibold text-slate-200 mt-0.5 block">
                {documents.length} Submitted File{documents.length === 1 ? '' : 's'}
              </span>
              <span className="text-[11px] text-slate-400 block">
                Field documentation
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ML Empirical Risk Analysis Card */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                ML Attention Analysis
              </h3>
              <p className="text-xs text-slate-400">
                Empirical attention engine evaluation based on remaining timeline and status
              </p>
            </div>
          </div>

          <AttentionBadge
            level={analysis?.attentionLevel || 'LOW'}
            score={analysis?.attentionScore}
            size="md"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2 space-y-3">
            <ScoreMeter
              score={analysis?.attentionScore || 0}
              level={analysis?.attentionLevel || 'LOW'}
              showLabel={true}
            />
            <p className="text-xs text-slate-400 leading-relaxed pt-2">
              {analysis?.attentionLevel === 'HIGH' ? (
                <span className="text-red-300">
                  <strong>High Attention Required:</strong> This action item is either past due or within critical 7-day delivery horizon without verified completion. Immediate frontliner intervention is advised.
                </span>
              ) : analysis?.attentionLevel === 'MEDIUM' ? (
                <span className="text-amber-300">
                  <strong>Medium Attention:</strong> Delivery timeline is approaching (within 8-14 days). Follow up with partner NGO coordinators to ensure timely progress reports.
                </span>
              ) : (
                <span className="text-emerald-300">
                  <strong>Standard Attention:</strong> Action item has sufficient lead time or has already been marked completed.
                </span>
              )}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Status Value:</span>
              <span className="font-semibold text-slate-200">{item.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Calculated Days:</span>
              <span className="font-mono font-semibold text-slate-200">{daysRemaining} days</span>
            </div>
            <div className="flex justify-between border-t border-slate-800 pt-2">
              <span className="text-slate-400">Model Source:</span>
              <span className="font-mono text-cyan-400">Python ML (8000)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Documents Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Form (1 Col) */}
        <div className="lg:col-span-1">
          <DocumentUpload
            actionItemId={item._id}
            onUploadSuccess={handleDocumentUploaded}
          />
        </div>

        {/* Uploaded Documents List (2 Cols) */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-800">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              <h3 className="text-base font-semibold text-white">Submitted Compliance Files</h3>
              <span className="px-2 py-0.2 text-xs font-bold rounded-full bg-slate-800 text-slate-300">
                {documents.length}
              </span>
            </div>
          </div>

          <DocumentList documents={documents} loading={docsLoading} />
        </div>
      </div>

      {/* Status Update Modal */}
      <StatusUpdateModal
        item={item}
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        onUpdated={handleStatusUpdated}
      />
    </div>
  );
};

