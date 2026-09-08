import api from '../index';

export const adminProductService = {
  getAll: (params) => api.get('/admin/products', { params }),
  getOne: (id) => api.get(`/admin/products/${id}`),
  create: (data) => api.post('/admin/products', data),
  update: (id, data) => api.put(`/admin/products/${id}`, data),
  delete: (id) => api.delete(`/admin/products/${id}`),
  toggleStatus: (id) => api.patch(`/admin/products/${id}/toggle-status`),
  uploadImages: (id, data) => api.post(`/admin/products/${id}/images`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  setPrimaryImage: (productId, imageId) => api.patch(`/admin/products/${productId}/images/${imageId}/primary`),
  deleteImage: (productId, imageId) => api.delete(`/admin/products/${productId}/images/${imageId}`),
};

export default adminProductService;
