import api from '../index';

export const homepageService = {
  getData: () => api.get('/homepage'),
};

export default homepageService;
