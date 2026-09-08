import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminAuthService } from '../api/services/adminAuthService';

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const checkAuth = async () => {
      const token = localStorage.getItem('muru_admin_token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await adminAuthService.getMe();
        if (isMounted) {
          setUser(response.data.user || response.data);
        }
      } catch (error) {
        console.error('Auth check failed', error);
        localStorage.removeItem('muru_admin_token');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    checkAuth();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogin = async ({ email, password }) => {
    const response = await adminAuthService.login({ email, password });
    if (response.data && response.data.token) {
      localStorage.setItem('muru_admin_token', response.data.token);
      setUser(response.data.user || response.data);
    }
    return { success: true, ...response.data };
  };

  const handleLogout = async () => {
    try {
      await adminAuthService.logout();
    } catch {
      // ignore
    } finally {
      localStorage.removeItem('muru_admin_token');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login: handleLogin,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
