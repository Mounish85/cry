import api from './api';

export const actionItemsAPI = {
  getAll: async () => {
    const response = await api.get('/action-items');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/action-items/${id}`);
    return response.data;
  },

  update: async (id, updateData) => {
    const response = await api.patch(`/action-items/${id}`, updateData);
    return response.data;
  },
};

