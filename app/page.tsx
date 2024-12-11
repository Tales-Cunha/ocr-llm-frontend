// app/page.tsx
'use client';

import { metadata } from './metadata';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/login');
  };

  const handleRegister = () => {
    router.push('/register');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200">
      <h1 className="text-4xl font-bold mb-8">{metadata.title}</h1>
      <p className="text-lg mb-4">{metadata.description}</p>
      <div className="flex space-x-4">
        <button
          onClick={handleLogin}
          className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          Entrar
        </button>
        <button
          onClick={handleRegister}
          className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
        >
          Registrar
        </button>
      </div>
    </div>
  );
}