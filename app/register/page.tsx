'use client';

import { useState, useContext, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import Link from 'next/link';

const RegisterPage = () => {
  const { register: registerUser } = useContext(AuthContext);
  const [form, setForm] = useState<{ name: string; email: string; password: string }>({
    name: '',
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

      if (form.name.trim() === '') {
        setError('O nome é obrigatório.');
        setLoading(false);
        return;
      }

      try {
        await registerUser(form.name, form.email, form.password);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || 'Erro ao registrar');
        } else {
          setError('Erro desconhecido ao registrar');
        }
      } finally {
        setLoading(false);
      }
    },
    [form, registerUser]
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="w-full max-w-sm p-6 bg-base-100 rounded shadow">
        <h2 className="mb-4 text-2xl font-bold text-center text-primary">Registrar</h2>
        {error && (
          <div className="alert alert-error mb-4" role="alert">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label htmlFor="name" className="label">
              <span className="label-text">Nome</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="input input-bordered"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Seu nome"
            />
          </div>
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
            {loading ? 'Carregando...' : 'Registrar'}
          </button>
        </form>
        <p className="mt-4 text-center">
          Já tem uma conta?{' '}
          <Link href="/login" className="text-primary hover:underline">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;