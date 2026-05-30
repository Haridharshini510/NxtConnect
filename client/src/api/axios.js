import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

let csrfTokenMemory = null;

let isRefreshing = false;
let pendingRequests = [];

const resolvePending = (error) => {
  pendingRequests.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve();
  });
  pendingRequests = [];
};

api.interceptors.request.use((config) => {
  const method = (config.method || 'get').toUpperCase();
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    const csrfToken = csrfTokenMemory;
    if (csrfToken) {
      config.headers = config.headers || {};
      config.headers['X-CSRF-Token'] = csrfToken;
    }
  }
  return config;
});

api.interceptors.response.use(
  (res) => {
    const reqUrl = res.config?.url || '';
    if (reqUrl.includes('/auth/csrf') && res.data?.csrfToken) {
      csrfTokenMemory = res.data.csrfToken;
    }
    return res;
  },
  async (err) => {
    const originalRequest = err.config || {};
    const reqUrl = originalRequest.url || '';
    const isAuthRequest =
      reqUrl.includes('/auth/login') ||
      reqUrl.includes('/auth/register') ||
      reqUrl.includes('/auth/me') ||
      reqUrl.includes('/auth/refresh') ||
      reqUrl.includes('/auth/logout') ||
      reqUrl.includes('/auth/csrf');

    const method = (originalRequest.method || 'get').toUpperCase();
    const isMutating = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);
    const isCsrfError =
      err.response?.status === 403 &&
      err.response?.data?.message === 'Invalid CSRF token';

    if (isCsrfError && isMutating && !reqUrl.includes('/auth/csrf') && !originalRequest._csrfRetry) {
      originalRequest._csrfRetry = true;
      try {
        const { data } = await api.get('/auth/csrf');
        if (data?.csrfToken) csrfTokenMemory = data.csrfToken;
        return api(originalRequest);
      } catch (csrfErr) {
        return Promise.reject(csrfErr);
      }
    }

    if (err.response?.status === 401 && !isAuthRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingRequests.push({
            resolve: () => resolve(api(originalRequest)),
            reject,
          });
        });
      }

      isRefreshing = true;
      try {
        await api.post('/auth/refresh');
        resolvePending(null);
        return api(originalRequest);
      } catch (refreshErr) {
        resolvePending(refreshErr);
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  }
);

export default api;
