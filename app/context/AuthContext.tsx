// app/context/AuthContext.tsx
'use client';

import { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import api from '@/utils/axios';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
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
      const { token } = response.data;
      console.log('Received Token:', token); // Log para verificar o token recebido
      setAuthToken(token);
      router.push('/upload');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || 'Erro ao fazer login.';
        console.error('Erro ao fazer login:', message);
        throw new Error(message); // Re-throw a mensagem específica
      } else {
        console.error('Erro ao fazer login:', error);
        throw new Error('Erro inesperado ao fazer login.');
      }
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    try {
      await api.post('/auth/register', { name, email, password });
      await login(email, password);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        console.error('Erro ao registrar: Email já está em uso.');
        throw new Error('Email já está em uso.');
      } else {
        console.error('Erro ao registrar:', error);
        throw new Error('Erro ao registrar. Tente novamente.');
      }
    }
  }, [login]);

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};