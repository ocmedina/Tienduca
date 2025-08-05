"use client";

import { useState, useEffect } from "react";
import {
  FaUtensils,
  FaHammer,
  FaTshirt,
  FaPaintBrush,
  FaLaptopCode,
  FaLeaf,
  FaBaby,
  FaShoppingBag,
  FaBicycle,
  FaBookOpen,
  FaList,
} from "react-icons/fa";
import { GiCakeSlice } from "react-icons/gi";

import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";  // Quité Pagination
import "swiper/css";
import "swiper/css/free-mode";  // Solo free-mode y sin paginación

const categorias = [
  { id: null, nombre: "Todos", icono: <FaList size={20} className="text-gray-500" /> },
  { id: "comida", nombre: "Comida casera", icono: <FaUtensils size={20} className="text-red-500" /> },
  { id: "pasteleria", nombre: "Pastelería", icono: <GiCakeSlice size={20} className="text-pink-400" /> },
  { id: "artesanias", nombre: "Artesanías", icono: <FaPaintBrush size={20} className="text-yellow-500" /> },
  { id: "lenceria", nombre: "Lencería", icono: <FaTshirt size={20} className="text-pink-500" /> },
  { id: "servicios-tecnicos", nombre: "Servicios técnicos", icono: <FaHammer size={20} className="text-indigo-500" /> },
  { id: "tecnologia", nombre: "Tecnología", icono: <FaLaptopCode size={20} className="text-green-600" /> },
  { id: "productos-naturales", nombre: "Productos naturales", icono: <FaLeaf size={20} className="text-emerald-500" /> },
  { id: "productos-bebe", nombre: "Productos para bebés", icono: <FaBaby size={20} className="text-pink-400" /> },
  { id: "moda", nombre: "Moda y accesorios", icono: <FaShoppingBag size={20} className="text-purple-600" /> },
  { id: "deportes", nombre: "Deportes y outdoor", icono: <FaBicycle size={20} className="text-cyan-500" /> },
  { id: "educacion", nombre: "Educación y cursos", icono: <FaBookOpen size={20} className="text-blue-500" /> },
];

type Props = {
  onCategoriaClick?: (id: string | null) => void;
};

const Categorias = ({ onCategoriaClick }: Props) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const renderButton = (id: string | null, nombre: string, icono: React.ReactNode) => {
    return (
      <button
        key={id ?? "todos"}
        onClick={() => onCategoriaClick?.(id)}
        className="bg-gray-100 rounded-xl shadow-sm flex flex-col items-center justify-center text-center hover:shadow-md hover:scale-105 transition-transform duration-150 w-20 h-20"
        style={{ margin: 0 }}
      >
        {icono}
        <span className="mt-1 text-xs text-gray-700 font-medium text-center px-1 leading-tight">{nombre}</span>
      </button>
    );
  };

  return (
    <section className="py-12 bg-white">
      <div className="text-center mb-10 px-4">
        <h2 className="text-2xl font-bold text-gray-900">Categorías destacadas</h2>
      </div>

      <div className="max-w-6xl mx-auto" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <Swiper
          modules={[FreeMode]}  
          spaceBetween={4}
          grabCursor={true}
          freeMode={true}
          slidesPerView={isMobile ? 2.8 : 6.2}
          centeredSlides={false}
          navigation={false}
          style={{ width: "100%" }}
        >
          {categorias.map(({ id, nombre, icono }) => (
            <SwiperSlide key={id ?? "todos"} style={{ width: "auto" }}>
              {renderButton(id, nombre, icono)}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Categorias;
