// app/layout.tsx
import './globals.css';
import { AuthProvider } from './context/AuthContext';
import { ReactNode } from 'react';
import Navbar from '../components/Navbar';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" data-theme="light">
      <body>
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen bg-base-200">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}