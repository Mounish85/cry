import api from './api';

export const documentsAPI = {
  upload: async (actionItemId, formData) => {
    const response = await api.post(`/documents/${actionItemId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getByActionItemId: async (actionItemId) => {
    const response = await api.get(`/documents/${actionItemId}`);
    return response.data;
  },
};

