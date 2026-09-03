import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  X, 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  Bell, 
  User as UserIcon, 
  LogOut, 
  LogIn, 
  UserPlus, 
  Shield 
} from 'lucide-react';

export const MobileDrawer = ({ isOpen, onClose }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogout = async () => {
    onClose();
    await logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/projects', label: 'Projects', icon: FolderKanban },
    { to: '/action-items', label: 'Action Items', icon: CheckSquare },
    { to: '/notifications', label: 'Notifications', icon: Bell },
    { to: '/profile', label: 'User Profile', icon: UserIcon },
  ];

  return (
    <div className="fixed inset-0 z-50 md:hidden flex">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative ml-auto w-4/5 max-w-sm h-full bg-[#0b1120] border-l border-slate-800 p-6 flex flex-col justify-between shadow-2xl z-10 overflow-y-auto">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                <Shield className="w-4 h-4 text-blue-400" />
              </div>
              <span className="font-bold text-white tracking-wide">CRY Navigation</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800/60"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User badge if logged in */}
          {isAuthenticated && (
            <div className="my-5 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-semibold text-white truncate">{user?.name}</span>
                <span className="text-xs text-slate-400 truncate">{user?.email}</span>
                <span className="mt-1 inline-block text-[10px] uppercase font-bold text-blue-400 tracking-wider">
                  {user?.role?.replace('_', ' ')}
                </span>
              </div>
            </div>
          )}

          {/* Navigation Items */}
          <nav className="space-y-1.5 mt-4">
            {isAuthenticated ? (
              navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </NavLink>
                );
              })
            ) : (
              <div className="space-y-3 pt-4">
                <NavLink
                  to="/login"
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium text-slate-200 bg-slate-800/80 border border-slate-700"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Log In</span>
                </NavLink>
                <NavLink
                  to="/signup"
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-glow-blue"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Sign Up</span>
                </NavLink>
              </div>
            )}
          </nav>
        </div>

        {/* Footer actions */}
        {isAuthenticated && (
          <div className="pt-6 border-t border-slate-800">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

