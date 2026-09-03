import api from './api';

export const authAPI = {
  signup: async (payload) => {
    const response = await api.post('/auth/signup', payload);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  logout: async () => {
    try {
      const response = await api.get('/auth/logout');
      return response.data;
    } catch {
      // Even if redirect causes an error in axios, we resolve cleanly
      return { message: 'Logged out successfully' };
    }
  },
};

