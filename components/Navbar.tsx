'use client';

import React, { useState, useContext, useRef, useEffect } from 'react';
import { AuthContext } from '../app/context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';

const Navbar = () => {
  const { logout } = useContext(AuthContext);
  const pathname = usePathname();
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleHomeRedirect = () => {
    router.push('/');
  };

  const handleToggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar bg-base-100 shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        <span
          className="text-2xl font-bold text-primary cursor-pointer"
          onClick={handleHomeRedirect}
        >
          OCR-LLM
        </span>
        {pathname !== '/login' && pathname !== '/register' && pathname !== '/' && (
          <div className="dropdown dropdown-end relative" ref={menuRef}>
            <button
              onClick={handleToggleMenu}
              className="btn btn-ghost rounded-btn"
            >
              Menu
            </button>
            {isMenuOpen && (
              <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 absolute right-0 mt-2 z-10">
                <li>
                  <button
                    onClick={() => handleNavigation('/upload')}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Upload
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigation('/documents')}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Documentos
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Sair
                  </button>
                </li>
              </ul>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;