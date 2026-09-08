import api from '../index';

export const pageService = {
  getAbout: () => api.get('/about-us'),
};

export default pageService;
