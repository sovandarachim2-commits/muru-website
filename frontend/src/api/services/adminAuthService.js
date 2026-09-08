import api from '../index';

export const adminAuthService = {
  login: (credentials) => api.post('/admin/login', credentials),
  logout: () => api.post('/admin/logout'),
  getMe: () => api.get('/admin/me'),
};

export default adminAuthService;
