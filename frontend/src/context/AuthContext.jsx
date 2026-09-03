import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const cached = localStorage.getItem('cry_user');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Check current session against backend /profile endpoint
  const checkAuth = useCallback(async () => {
    try {
      const data = await authAPI.getProfile();
      if (data && data.user) {
        // Keep any role/ngoId from previous cache if not returned in profile
        setUser((prev) => {
          const updated = {
            ...prev,
            ...data.user,
          };
          localStorage.setItem('cry_user', JSON.stringify(updated));
          return updated;
        });
      }
    } catch (err) {
      // Unauthenticated or expired session
      setUser(null);
      localStorage.removeItem('cry_token');
      localStorage.removeItem('cry_user');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Login
  const login = async (email, password) => {
    const data = await authAPI.login({ email, password });
    if (data.token) {
      localStorage.setItem('cry_token', data.token);
    }
    if (data.user) {
      setUser(data.user);
      localStorage.setItem('cry_user', JSON.stringify(data.user));
    }
    return data;
  };

  // Signup
  const signup = async (userData) => {
    const data = await authAPI.signup(userData);
    if (data.token) {
      localStorage.setItem('cry_token', data.token);
    }
    if (data.user) {
      setUser(data.user);
      localStorage.setItem('cry_user', JSON.stringify(data.user));
    }
    return data;
  };

  // Logout
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.warn('Logout request warning:', err);
    } finally {
      setUser(null);
      localStorage.removeItem('cry_token');
      localStorage.removeItem('cry_user');
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    login,
    signup,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

