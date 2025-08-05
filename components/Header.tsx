"use client";

import Image from "next/image";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

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
          <a href="#categorias" className="hover:text-blue-600 transition">Categorías</a>
          <a href="#sumate" className="hover:text-blue-600 transition">Sumate</a>
        </nav>

        {/* Botón CTA desktop */}
        <a
          href="#sumate"
          className="hidden sm:inline-block bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          Publicá gratis
        </a>

        {/* Botón hamburguesa mobile */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden p-2 rounded-md text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
          aria-label="Toggle menu"
        >
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Menú desplegable mobile */}
      {menuOpen && (
        <nav className="sm:hidden bg-white border-t border-gray-200 shadow-md">
          <div className="flex flex-col px-6 py-4 space-y-4 text-gray-700 font-medium">
            <a
              href="#"
              onClick={() => setMenuOpen(false)}
              className="hover:text-blue-600 transition"
            >
              Inicio
            </a>
            <a
              href="#emprendedores"
              onClick={() => setMenuOpen(false)}
              className="hover:text-blue-600 transition"
            >
              Emprendedores
            </a>
            <a
              href="#categorias"
              onClick={() => setMenuOpen(false)}
              className="hover:text-blue-600 transition"
            >
              Categorías
            </a>
            <a
              href="#sumate"
              onClick={() => setMenuOpen(false)}
              className="hover:text-blue-600 transition"
            >
              Sumate
            </a>
            <a
              href="#sumate"
              onClick={() => setMenuOpen(false)}
              className="bg-blue-600 text-white text-center rounded-lg px-4 py-2 shadow hover:bg-blue-700 transition"
            >
              Publicá gratis
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
