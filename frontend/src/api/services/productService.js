import api from '../index';

export const productService = {
  getAll: (params) => api.get('/products', { params }),
  getBySlug: (slug) => api.get(`/products/${slug}`),
  getRelated: (slug) => api.get(`/products/${slug}/related`),
};

export default productService;
