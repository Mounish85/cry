import { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { documentsAPI } from '../../api/documents';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  X,
  FileSpreadsheet
} from 'lucide-react';

export const DocumentUpload = ({ actionItemId, onUploadSuccess }) => {
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [documentType, setDocumentType] = useState('Field Visit Report');
  const [customType, setCustomType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const predefinedTypes = [
    'Field Visit Report',
    'Quarterly Progress Report',
    'Financial & Audit Summary',
    'Beneficiary Verification Sheet',
    'Activity Proof / Photographic Evidence',
    'Utilization Certificate',
    'Other / Custom Document',
  ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    setError('');
    setSuccessMessage('');

    // Check size (5MB limit as per backend uploadMiddleware)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size exceeds the 5MB limit. Please choose a smaller file.');
      return;
    }

    // Check file extension / mime type
    const validExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx'];
    const fileName = selectedFile.name.toLowerCase();
    const isValid = validExtensions.some((ext) => fileName.endsWith(ext));

    if (!isValid) {
      setError('Only PDF, Word (.doc, .docx) and Excel (.xls, .xlsx) files are accepted.');
      return;
    }

    setFile(selectedFile);
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a document to upload');
      return;
    }

    const finalType = documentType === 'Other / Custom Document'
      ? customType.trim() || 'General Supporting Document'
      : documentType;

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('documentType', finalType);
      if (user?.id) {
        formData.append('uploadedBy', user.id);
      }

      const response = await documentsAPI.upload(actionItemId, formData);
      setSuccessMessage('Document uploaded and linked successfully!');
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      if (onUploadSuccess) {
        onUploadSuccess(response.document);
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || 'Failed to upload document. Please check file format.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800">
      <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800 mb-5">
        <UploadCloud className="w-5 h-5 text-blue-400" />
        <h3 className="text-base font-semibold text-white">Upload Compliance Document</h3>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2 text-xs text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2 text-xs text-emerald-400">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Document Type Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Document Category / Type <span className="text-blue-400">*</span>
          </label>
          <select
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
            className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:ring-1 focus:ring-blue-500 bg-slate-900 border border-slate-700"
          >
            {predefinedTypes.map((type) => (
              <option key={type} value={type} className="bg-slate-900 text-slate-200">
                {type}
              </option>
            ))}
          </select>
        </div>

        {documentType === 'Other / Custom Document' && (
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Specify Document Title <span className="text-blue-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Field Beneficiary Survey Data"
              value={customType}
              onChange={(e) => setCustomType(e.target.value)}
              className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-slate-200 bg-slate-900 border border-slate-700"
              required
            />
          </div>
        )}

        {/* Dropzone */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            File Attachment (PDF, Word, Excel — Max 5MB) <span className="text-blue-400">*</span>
          </label>

          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => !file && fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
              dragActive
                ? 'border-blue-500 bg-blue-500/10'
                : file
                ? 'border-emerald-500/40 bg-emerald-500/5'
                : 'border-slate-700/80 bg-slate-900/40 hover:border-slate-600 cursor-pointer'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.xls,.xlsx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              className="hidden"
            />

            {file ? (
              <div className="flex items-center justify-between gap-3 p-2 bg-slate-800/80 rounded-xl border border-slate-700">
                <div className="flex items-center gap-3 overflow-hidden text-left">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-medium text-slate-100 truncate">
                      {file.name}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile();
                  }}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-2">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-3">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <p className="text-xs font-semibold text-slate-200">
                  Click to browse or drag and drop document
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Supports .pdf, .doc, .docx, .xls, .xlsx (up to 5MB)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Submit button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={!file || loading}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-glow-blue transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Uploading Document...</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-4 h-4" />
                <span>Upload Document</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

