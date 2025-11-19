import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
    let mounted = true;
    async function init() {
      try {
        const token = await AsyncStorage.getItem('access_token');
        if (token) {
          try {
            setAuthToken(token);
            const u = await getCurrentUser();
            if (mounted) {
              setUser(u as User);
            }
          } catch (e) {
            // token invalid or expired
            if (mounted) {
              setAuthToken(undefined);
              await AsyncStorage.removeItem('access_token');
            }
          }
        }
      } catch (e) {
        console.error('Error loading auth token:', e);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }
    init();
    return () => {
      mounted = false;
    };
  }, []);

  async function login(username: string, password: string) {
    const data = await loginUser(username, password);
    if (data?.access_token) {
      await AsyncStorage.setItem('access_token', data.access_token);
      await AsyncStorage.setItem('token_type', data.token_type ?? 'bearer');
      setAuthToken(data.access_token);
      const u = await getCurrentUser();
      setUser(u as User);
      return u as User;
    }
    throw new Error('No token received');
  }

  async function logout() {
    setUser(null);
    setAuthToken(undefined);
    await AsyncStorage.removeItem('access_token');
    await AsyncStorage.removeItem('token_type');
  }

  function register(payload: any) {
    return registerUser(payload);
  }

  async function updateUser(payload: Partial<User>) {
    try {
      const { updateCurrentUser } = await import('../api/api');
      const updated = await updateCurrentUser(payload as any);
      setUser(updated as User);
      return updated as User;
    } catch (e) {
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

