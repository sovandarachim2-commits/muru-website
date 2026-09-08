import api from '../index';

export const adminContentService = {
  getDashboard: () => api.get('/admin/dashboard'),
  getHomepage: () => api.get('/admin/homepage'),
  updateHomepage: (data) => api.post('/admin/homepage', data),
  getAbout: () => api.get('/admin/about'),
  updateAbout: (data) => api.post('/admin/about', data),
  updateContact: (data) => api.post('/admin/contact', data),
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (data) => api.post('/admin/settings', data),
};

export default adminContentService;
