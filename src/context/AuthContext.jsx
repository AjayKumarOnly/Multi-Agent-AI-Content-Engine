import { createContext, useContext, useState } from 'react';
import { authService } from '../services/authService';
import { DEMO_USER } from '../mocks/mockData';

const AuthContext = createContext(null);

const LOGOUT_FLAG_KEY = 'maice_logged_out';

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    const stored = authService.getStoredSession();
    if (stored) return stored;
    if (localStorage.getItem(LOGOUT_FLAG_KEY) === 'true') return null;
    return { token: 'demo-session', user: DEMO_USER };
  });

  const login = async (credentials) => {
    localStorage.removeItem(LOGOUT_FLAG_KEY);
    const data = await authService.login(credentials);
    setSession({ token: data.token, user: data.user });
    return data;
  };

  const register = async (payload) => {
    localStorage.removeItem(LOGOUT_FLAG_KEY);
    const data = await authService.register(payload);
    setSession({ token: data.token, user: data.user });
    return data;
  };

  const logout = () => {
    localStorage.setItem(LOGOUT_FLAG_KEY, 'true');
    authService.logout();
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user: session?.user || null,
        isAuthenticated: Boolean(session?.token),
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
