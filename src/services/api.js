import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

/**
 * Shared Axios instance configured for the Spring Boot API gateway.
 * Automatically attaches JWT Bearer tokens when present.
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('maice_jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('maice_jwt_token');
    }
    return Promise.reject(error);
  }
);

export const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false';
export { API_BASE_URL };
export default apiClient;
