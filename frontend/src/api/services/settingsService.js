import api from '../index';

export const settingsService = {
  getSettings: () => api.get('/settings'),
};

export default settingsService;
