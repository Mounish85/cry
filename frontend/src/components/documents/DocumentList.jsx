import { FileText, Download, ExternalLink, Calendar, User, FileSpreadsheet } from 'lucide-react';

export const DocumentList = ({ documents = [], loading = false }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recently';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getFileIcon = (fileUrl = '') => {
    const lower = fileUrl.toLowerCase();
    if (lower.endsWith('.xls') || lower.endsWith('.xlsx')) {
      return FileSpreadsheet;
    }
    return FileText;
  };

  if (loading) {
    return (
      <div className="space-y-3 animate-pulse">
        {[1, 2].map((n) => (
          <div key={n} className="h-16 bg-slate-800/50 rounded-xl w-full" />
        ))}
      </div>
    );
  }

  if (!documents || documents.length === 0) {
    return (
      <div className="p-8 text-center rounded-xl bg-slate-900/40 border border-slate-800/80">
        <FileText className="w-8 h-8 text-slate-600 mx-auto mb-2" />
        <p className="text-xs font-medium text-slate-300">No documents submitted yet</p>
        <p className="text-[11px] text-slate-500 mt-0.5">
          Attach required verification files, field reports, or audits using the upload panel.
        </p>
      </div>
    );
  }

  // Base backend URL for file access
  const backendBase = 'http://localhost:3000';

  return (
    <div className="space-y-3">
      {documents.map((doc) => {
        const Icon = getFileIcon(doc.fileUrl);
        const fullUrl = doc.fileUrl?.startsWith('http')
          ? doc.fileUrl
          : `${backendBase}${doc.fileUrl}`;
        const fileName = doc.fileUrl ? doc.fileUrl.split('/').pop() : 'Document';

        return (
          <div
            key={doc._id}
            className="flex items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all group"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-white truncate">
                    {doc.documentType || 'Uploaded Document'}
                  </span>
                  <span className="px-1.5 py-0.2 text-[10px] font-mono rounded bg-slate-800 text-slate-400 border border-slate-700 shrink-0">
                    {fileName.split('.').pop()?.toUpperCase() || 'FILE'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(doc.createdAt)}</span>
                  </div>
                  <span className="truncate max-w-[140px] text-slate-500">
                    {fileName}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href={fullUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
                title="View document"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">View</span>
              </a>
              <a
                href={fullUrl}
                download
                className="p-1.5 text-slate-400 hover:text-blue-400 bg-slate-800/80 hover:bg-slate-800 rounded-lg border border-slate-700 transition-colors"
                title="Download file"
              >
                <Download className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
};

