import apiClient, { USE_MOCK_API } from './api';
import { DEMO_USER } from '../mocks/mockData';

const TOKEN_KEY = 'maice_jwt_token';
const USER_KEY = 'maice_user';

export const authService = {
  async login({ email, password, rememberMe }) {
    if (!USE_MOCK_API) {
      const { data } = await apiClient.post('/auth/login', { email, password, rememberMe });
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      return data;
    }

    await new Promise((r) => setTimeout(r, 600));
    if (!email || !password || password.length < 6) {
      throw new Error('Invalid email or password (minimum 6 characters).');
    }

    const user = {
      ...DEMO_USER,
      email,
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    };
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo_jwt_payload.signature';
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return { token, user };
  },

  async register({ name, email, password }) {
    if (!USE_MOCK_API) {
      const { data } = await apiClient.post('/auth/register', { name, email, password });
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      return data;
    }

    await new Promise((r) => setTimeout(r, 700));
    const user = {
      ...DEMO_USER,
      name: name || DEMO_USER.name,
      email,
      avatarInitials: (name || 'AR')
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
    };
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo_jwt_payload.signature';
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return { token, user };
  },

  async requestPasswordReset(email) {
    if (!USE_MOCK_API) {
      const { data } = await apiClient.post('/auth/forgot-password', { email });
      return data;
    }
    await new Promise((r) => setTimeout(r, 500));
    return { message: `Password reset instructions dispatched to ${email}.` };
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getStoredSession() {
    const token = localStorage.getItem(TOKEN_KEY);
    const rawUser = localStorage.getItem(USER_KEY);
    if (!token) return null;
    try {
      return { token, user: rawUser ? JSON.parse(rawUser) : DEMO_USER };
    } catch {
      return { token, user: DEMO_USER };
    }
  },
};
