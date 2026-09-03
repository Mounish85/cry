import axios from 'axios';

/**
 * Centralized Axios instance for the CRY Project Monitoring System.
 * ALWAYS includes withCredentials: true so JWT cookies are sent with every request.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/cry',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach token from localStorage as fallback for environments where cookies are blocked
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cry_token');
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle errors cleanly
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Session expired or unauthenticated
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup') && window.location.pathname !== '/') {
        localStorage.removeItem('cry_token');
        localStorage.removeItem('cry_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;

