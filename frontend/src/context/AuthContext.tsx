import React, { createContext, useContext, useEffect, useState } from 'react';
import { loginUser, registerUser, setAuthToken, getCurrentUser } from '../api/api';

export interface User {
  id: string;
  email: string;
  username: string;
  nombre?: string;
  apellido?: string;
  rut?: string;
  activo?: boolean;
  rol?: string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<User>;
  logout: () => void;
  register: (payload: any) => Promise<any>;
  updateUser?: (payload: Partial<User>) => Promise<User | null>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          setAuthToken(token);
          const u = await getCurrentUser();
          setUser(u as User);
        } catch (e) {
          // token invalid or expired
          setAuthToken(undefined);
          localStorage.removeItem('access_token');
        }
      }
      setLoading(false);
    }
    init();
  }, []);

  async function login(username: string, password: string) {
    const data = await loginUser(username, password);
    if (data?.access_token) {
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('token_type', data.token_type ?? 'bearer');
      setAuthToken(data.access_token);
      const u = await getCurrentUser();
      setUser(u as User);
      return u as User;
    }
    throw new Error('No token received');
  }

  function logout() {
    setUser(null);
    setAuthToken(undefined);
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_type');
  }

  function register(payload: any) {
    return registerUser(payload);
  }

  async function updateUser(payload: Partial<User>) {
    try {
      // Try to call backend to persist changes
      // Import dynamically to avoid circular issues
      const { updateCurrentUser } = await import('../api/api');
      const updated = await updateCurrentUser(payload as any);
      setUser(updated as User);
      return updated as User;
    } catch (e) {
      // If backend doesn't support update, just update local state
      setUser(u => (u ? { ...u, ...payload } : u));
      return user;
    }
  }

  return React.createElement(
    AuthContext.Provider,
    { value: { user, loading, login, logout, register, updateUser } },
    children
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
