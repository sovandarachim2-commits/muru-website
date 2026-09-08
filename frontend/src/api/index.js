import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('muru_admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    if (response) {
      // 401 Unauthorized - redirect to login
      if (response.status === 401) {
        localStorage.removeItem('muru_admin_token');
        if (!window.location.pathname.includes('/login') && window.location.pathname.includes('/admin')) {
          toast.error('Session expired. Please login again.');
          window.location.href = '/login';
        }
      } 
      // 422 Validation Errors
      else if (response.status === 422) {
        // Handled by specific components
      }
      // 403 Forbidden
      else if (response.status === 403) {
        toast.error('You do not have permission to perform this action.');
      }
      // 500+ Server Errors
      else if (response.status >= 500) {
        toast.error('A server error occurred. Please try again later.');
      }
      // Other errors
      else {
        toast.error(response.data.message || 'An unexpected error occurred.');
      }
    } else {
      toast.error('Network error. Please check your connection.');
    }

    return Promise.reject(error);
  }
);

export default api;
