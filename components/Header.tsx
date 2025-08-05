// components/Header.tsx

import Image from "next/image";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo único (incluye el nombre) */}
        <div className="flex-shrink-0">
          <Image
            src="/12.png"
            alt="Logo Tienduca"
            width={100} // ajustable según se vea
            height={60}
            priority
          />
        </div>

        {/* Navegación */}
        <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-gray-700">
          <a href="#" className="hover:text-blue-600 transition">Inicio</a>
          <a href="#emprendedores" className="hover:text-blue-600 transition">Emprendedores</a>
          <a href="#categorias" className="hover:text-blue-600 transition">Categorías</a>
          <a href="#sumate" className="hover:text-blue-600 transition">Sumate</a>
        </nav>

        {/* Botón CTA */}
        <a
          href="#sumate"
          className="hidden sm:inline-block bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          Publicá gratis
        </a>
      </div>
    </header>
  );
}
