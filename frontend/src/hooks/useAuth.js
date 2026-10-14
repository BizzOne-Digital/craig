import { createContext, createElement, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { adminLogin as loginRequest, adminLogout as logoutRequest, adminMe } from '../services/adminApi.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    try {
      setError(null);
      const data = await adminMe();
      setAdmin(data?.admin ?? null);
      return data?.admin ?? null;
    } catch {
      setAdmin(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const data = await loginRequest(credentials);
      setAdmin(data?.admin ?? null);
      return data?.admin ?? null;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await logoutRequest();
    } catch {
      // Clear local state even if network logout fails
    } finally {
      setAdmin(null);
      setLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      admin,
      loading,
      error,
      isAuthenticated: Boolean(admin),
      login,
      logout,
      refresh,
    }),
    [admin, loading, error, login, logout, refresh]
  );

  return createElement(AuthContext.Provider, { value }, children);
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export default useAuth;
