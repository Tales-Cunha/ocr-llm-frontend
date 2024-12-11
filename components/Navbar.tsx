'use client';

import { useContext } from 'react';
import { AuthContext } from '../app/context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const pathname = usePathname();
  const router = useRouter();

  const handleHomeRedirect = () => {
    router.push('/');
  };

  return (
    <div className="navbar bg-base-100 shadow-md">
      <div className="container mx-auto flex">
        <span
          className="text-2xl font-bold text-primary cursor-pointer"
          onClick={handleHomeRedirect}
        >
          OCR-LLM
        </span>
        {pathname !== '/login' && pathname !== '/register' && pathname !== '/' && (
          <div className="flex space-x-4 ml-auto">
      
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost rounded-btn">
                  Menu
                </label>
                <ul
                  tabIndex={0}
                  className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
                >
                  <li>
                    <a href="/upload">Upload</a>
                  </li>
                  <li>
                    <a href="/documents">Documentos</a>
                  </li>
                  <li>
                    <button onClick={logout}>Sair</button>
                  </li>
                </ul>
              </div>
  
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;