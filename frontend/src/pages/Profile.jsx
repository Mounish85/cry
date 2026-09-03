import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Shield, 
  Building2, 
  Key, 
  LogOut, 
  CheckCircle2, 
  Clock, 
  ShieldCheck,
  Calendar
} from 'lucide-react';

export const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          User Account & Organization
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Review your operational credentials, verified permissions, and security session.
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="glass-card rounded-3xl p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-8 border-b border-slate-800">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 shadow-glow-blue shrink-0">
            <div className="w-full h-full bg-[#0b1120] rounded-[14px] flex items-center justify-center text-2xl font-black text-white">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
          </div>

          <div className="space-y-1.5 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <h2 className="text-xl font-bold text-white">{user?.name || 'Verified Member'}</h2>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30 capitalize">
                {user?.role ? user.role.toLowerCase().replace('_', ' ') : 'Frontliner'}
              </span>
            </div>
            <p className="text-xs text-slate-400">{user?.email}</p>
            <div className="flex items-center justify-center sm:justify-start gap-2 pt-1 text-[11px] text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Active Authenticated Session (Cookie JWT)</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rose-300 hover:text-white bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/20 rounded-xl transition-all shadow-sm"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Credentials & System Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8 text-xs">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <div className="flex items-center gap-2 text-slate-400">
              <User className="w-3.5 h-3.5 text-blue-400" />
              <span className="font-semibold">User Unique ID</span>
            </div>
            <p className="text-slate-200 font-mono text-[11px] pt-1">
              {user?.id || 'System Generated ID'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <div className="flex items-center gap-2 text-slate-400">
              <Shield className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-semibold">Role Tier</span>
            </div>
            <p className="text-slate-200 font-semibold pt-1">
              {user?.role === 'PARTNER_NGO'
                ? 'Partner NGO Representative'
                : 'CRY Frontline Officer'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <div className="flex items-center gap-2 text-slate-400">
              <Mail className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-semibold">Official Email</span>
            </div>
            <p className="text-slate-200 font-medium pt-1 truncate">
              {user?.email || 'Not available'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <div className="flex items-center gap-2 text-slate-400">
              <Building2 className="w-3.5 h-3.5 text-purple-400" />
              <span className="font-semibold">Affiliated Organization</span>
            </div>
            <p className="text-slate-200 font-medium pt-1">
              {user?.ngoId
                ? `Partner NGO #${user.ngoId.substring(0, 8)}...`
                : 'Child Rights and You (CRY India)'}
            </p>
          </div>
        </div>

        {/* Security & Access Policies */}
        <div className="mt-8 p-5 rounded-2xl bg-blue-500/5 border border-blue-500/20 flex items-start gap-3.5 text-xs text-slate-300">
          <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-white">Cryptographic Session Protection</h4>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Your session is authenticated via HttpOnly cookie signed by CRY backend services. All document uploads and action item updates are cryptographically bound to your user record.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

