import axios from 'axios';

const api = axios.create({
  baseURL: 'https://hirehub-ats-3dqk.onrender.com/api',
});

// Request interceptor to attach JWT token to every outgoing request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to clear auth state and redirect on 401/403
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Prevent infinite redirect loops for non-protected layouts
      const path = window.location.pathname;
      if (
        path !== '/candidate/login' &&
        path !== '/recruiter/login' &&
        path !== '/register' &&
        path !== '/' &&
        path !== '/jobs'
      ) {
        if (path.startsWith('/recruiter')) {
          window.location.href = '/recruiter/login?expired=true';
        } else {
          window.location.href = '/candidate/login?expired=true';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
