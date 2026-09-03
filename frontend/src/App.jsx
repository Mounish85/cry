import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, PublicOnlyRoute } from './components/ProtectedRoute';
import { Layout } from './components/layout/Layout';

// Pages
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { Projects } from './pages/Projects';
import { ProjectDetails } from './pages/ProjectDetails';
import { ActionItems } from './pages/ActionItems';
import { ActionItemDetails } from './pages/ActionItemDetails';
import { Notifications } from './pages/Notifications';
import { Profile } from './pages/Profile';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Layout wrapper containing Navbar, Content, and Footer */}
        <Route element={<Layout />}>
          {/* Public Landing Page */}
          <Route path="/" element={<Home />} />

          {/* Public-only Authentication Routes */}
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicOnlyRoute>
                <Signup />
              </PublicOnlyRoute>
            }
          />

          {/* Protected Application Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <Projects />
              </ProtectedRoute>
            }
          />

          <Route
            path="/projects/:id"
            element={
              <ProtectedRoute>
                <ProjectDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/action-items"
            element={
              <ProtectedRoute>
                <ActionItems />
              </ProtectedRoute>
            }
          />

          <Route
            path="/action-items/:id"
            element={
              <ProtectedRoute>
                <ActionItemDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* 404 Fallback */}
          <Route
            path="*"
            element={
              <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
                <h1 className="text-6xl font-black text-slate-700 mb-2">404</h1>
                <h2 className="text-xl font-bold text-white mb-2">Page Not Found</h2>
                <p className="text-xs text-slate-400 max-w-sm mb-6">
                  The resource you are attempting to view does not exist or has been relocated.
                </p>
                <a
                  href="/dashboard"
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-glow-blue transition-all"
                >
                  Return to Dashboard
                </a>
              </div>
            }
          />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
