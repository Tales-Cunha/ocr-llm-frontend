'use client';

import { useState, useContext, useCallback } from 'react';
import { AuthContext } from '../app/context/AuthContext';
import Link from 'next/link';

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState<{ email: string; password: string }>({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setForm((prevForm) => ({
        ...prevForm,
        [name]: value,
      }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError(null);
      
      // Validação básica
      const emailRegex = /\S+@\S+\.\S+/;
      if (!emailRegex.test(form.email)) {
        setError('Email inválido.');
        setLoading(false);
        return;
      }

      if (form.password.length < 6) {
        setError('A senha deve ter pelo menos 6 caracteres.');
        setLoading(false);
        return;
      }

      try {
        await login(form.email, form.password);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || 'Erro ao fazer login');
        } else {
          setError('Erro desconhecido ao fazer login');
        }
      } finally {
        setLoading(false);
      }
    },
    [form, login]
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="w-full max-w-sm p-6 bg-base-100 rounded shadow">
        <h2 className="mb-4 text-2xl font-bold text-center text-primary">Entrar</h2>
        {error && (
          <div className="alert alert-error mb-4" role="alert">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label htmlFor="email" className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="input input-bordered"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="email@example.com"
            />
          </div>
          <div className="form-control">
            <label htmlFor="password" className="label">
              <span className="label-text">Senha</span>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="input input-bordered"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="********"
            />
          </div>
          <button
            type="submit"
            className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Carregando...' : 'Entrar'}
          </button>
        </form>
        <p className="mt-4 text-center">
          Não tem uma conta?{' '}
          <Link href="/register" className="text-primary hover:underline">
            Registre-se
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;