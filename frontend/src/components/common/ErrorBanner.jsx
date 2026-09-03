import { AlertCircle, RefreshCw } from 'lucide-react';

export const ErrorBanner = ({ message, onRetry }) => {
  if (!message) return null;

  return (
    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/25 flex items-start gap-3 my-4 backdrop-blur-sm">
      <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
      <div className="flex-1">
        <h4 className="text-sm font-semibold text-red-300">Request Error</h4>
        <p className="text-sm text-red-400/90 mt-0.5">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-red-300 hover:text-white bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
};

