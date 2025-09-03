"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  const profileMenuRefDesktop = useRef<HTMLDivElement>(null);
  const profileMenuRefMobile = useRef<HTMLDivElement>(null);

  const profileInitial = user?.displayName
    ? user.displayName.charAt(0).toUpperCase()
    : "U";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        (profileMenuRefDesktop.current &&
          !profileMenuRefDesktop.current.contains(event.target as Node)) &&
        (profileMenuRefMobile.current &&
          !profileMenuRefMobile.current.contains(event.target as Node))
      ) {
        setProfileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setProfileMenuOpen(false);
    router.push("/");
  };

  if (loading) return null;

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Image src="/12.png" alt="Logo Tienduca" width={100} height={60} priority />
        </div>

        {/* Navegación desktop */}
        <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-gray-700">
          <a href="#" className="hover:text-blue-600 transition">Inicio</a>
          <a href="#emprendedores" className="hover:text-blue-600 transition">Emprendedores</a>
          <a href="#sumate" className="hover:text-blue-600 transition">Sumate</a>
        </nav>

        {/* Botones desktop */}
        <div className="hidden sm:flex items-center gap-3 relative">
          {!user ? (
            <>
              <Link
                href="/login"
                className="bg-yellow-300 text-sm font-medium text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-yellow-400 transition"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/registro"
                className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
              >
                Registrarse
              </Link>
            </>
          ) : (
            <div className="relative" ref={profileMenuRefDesktop}>
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center text-lg font-bold focus:outline-none focus:ring-2 focus:ring-green-500"
                title="Ir a Perfil"
                aria-label="Abrir menú de perfil"
              >
                {profileInitial}
              </button>

              <AnimatePresence>
                {profileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-lg z-50"
                  >
                    <Link
                      href="/perfil"
                      className="block px-4 py-2 hover:bg-gray-100 transition rounded-md"
                    >
                      Mi perfil
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 hover:bg-red-600 hover:text-white rounded-md transition"
                    >
                      Cerrar sesión
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Mobile: botón hamburguesa + perfil */}
        <div className="flex items-center gap-3 sm:hidden">
          {user && (
            <div className="relative" ref={profileMenuRefMobile}>
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center text-lg font-bold focus:outline-none focus:ring-2 focus:ring-green-500"
                aria-label="Abrir menú de perfil"
              >
                {profileInitial}
              </button>

              <AnimatePresence>
                {profileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-lg z-50"
                  >
                    <Link
                      href="/perfil"
                      onClick={() => setProfileMenuOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-100 transition rounded-md"
                    >
                      Mi perfil
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setProfileMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-red-600 hover:text-white rounded-md transition"
                    >
                      Cerrar sesión
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-md text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
            aria-label="Toggle menu"
          >
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Menú desplegable mobile */}
      {menuOpen && (
        <nav className="sm:hidden bg-white border-t border-gray-200 shadow-md">
          <div className="flex flex-col px-6 py-4 space-y-4 text-gray-700 font-medium">
            <a href="#" onClick={() => setMenuOpen(false)} className="hover:text-blue-600 transition">Inicio</a>
            <a href="#emprendedores" onClick={() => setMenuOpen(false)} className="hover:text-blue-600 transition">Emprendedores</a>
            <a href="#sumate" onClick={() => setMenuOpen(false)} className="hover:text-blue-600 transition">Sumate</a>

            {!user && (
              <>
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="bg-yellow-300 border border-gray-300 text-center rounded-lg px-4 py-2 hover:bg-yellow-400 transition"
                >
                  Iniciar sesión
                </Link>

                <Link
                  href="/registro"
                  onClick={() => setMenuOpen(false)}
                  className="bg-blue-600 text-white text-center rounded-lg px-4 py-2 shadow hover:bg-blue-700 transition"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
