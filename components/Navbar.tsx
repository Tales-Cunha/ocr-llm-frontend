'use client';

import Link from 'next/link';
import { useContext } from 'react';
import { AuthContext } from '../app/context/AuthContext';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const pathname = usePathname();

  if (pathname === '/login' || pathname === '/register') {
    return null;
  }

  return (
    <div className="navbar bg-base-100 shadow-md">
      <div className="container mx-auto">
        <div className="flex-1">
          <Link href="/" className="text-xl font-bold text-primary">
            OCR-LLM
          </Link>
        </div>
        <div className="flex-none">
          {user ? (
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost rounded-btn">
                Menu
              </label>
              <ul
                tabIndex={0}
                className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li>
                  <Link href="/upload">Upload</Link>
                </li>
                <li>
                  <Link href="/documents">Documentos</Link>
                </li>
                <li>
                  <button onClick={logout}>Sair</button>
                </li>
              </ul>
            </div>
          ) : (
            <div className="flex space-x-2">
              <Link href="/login" className="btn btn-primary btn-outline">
                Entrar
              </Link>
              <Link href="/register" className="btn btn-primary">
                Registrar
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;