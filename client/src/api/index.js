import api from './axios';

export const authAPI = {
  getCsrfToken: () => api.get('/auth/csrf'),
  getMe: () => api.get('/auth/me'),
  login: (credentials) => api.post('/auth/login', credentials),
  checkEmail: (email) => api.post('/auth/check-email', { email }),
  refresh: () => api.post('/auth/refresh'),
  logout: () => api.post('/auth/logout'),
  register: (userData) => api.post('/auth/register', userData),
  // Add other auth endpoints as needed
};

export const notificationAPI = {
  getUnreadCount: () => api.get('/notifications/unread-count'),
  getAll: () => api.get('/notifications'),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.patch('/notifications/mark-all-read'),
  delete: (id) => api.delete(`/notifications/${id}`),
};
