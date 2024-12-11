'use client';

import { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import api from '@/utils/axios';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
  // Adicione outros campos conforme necessário
}

interface AuthContextProps {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  token: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const decoded: User = jwtDecode(storedToken);
        setUser(decoded);
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        setToken(storedToken);
      } catch (error) {
        console.error('Erro ao decodificar o token:', error);
        // Opcional: Limpar token inválido
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      }
    }
  }, []);

  const setAuthToken = (token: string) => {
    localStorage.setItem('token', token);
    setToken(token);
    const decoded: User = jwtDecode(token);
    setUser(decoded);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      setAuthToken(response.data.token);
      router.push('/upload');
    } catch (error) {
      throw error;
    }
  }, [router]);

  const register = useCallback(async (name: string, email: string, password: string) => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      setAuthToken(response.data.token);
      router.push('/upload');
    } catch (error) {
      throw error;
    }
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    router.push('/login');
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};