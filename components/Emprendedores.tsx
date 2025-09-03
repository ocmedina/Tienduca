"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { db } from "@/firebase/firebaseConfig";
import { collectionGroup, getDocs, query, orderBy } from "firebase/firestore";
import {
  FaWhatsapp,
  FaInstagram,
  FaFacebookF,
  FaTiktok,
  FaGlobe,
  FaList,
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
} from "react-icons/fa";
import { GiCakeSlice } from "react-icons/gi";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";

type Emprendimiento = {
  id: string;
  nombre: string;
  categoria: string;
  descripcion: string;
  contacto: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  web?: string;
  imageUrl?: string; // CAMBIO IMPORTANTE: Ahora se usa 'imageUrl' en lugar de 'imagen'
};

const categorias = [
  "Todos",
  "Comida casera",
  "Pastelería",
  "Artesanías",
  "Lencería",
  "Servicios técnicos",
  "Tecnología",
  "Productos naturales",
  "Productos para bebés",
  "Moda y accesorios",
  "Deportes y outdoor",
  "Educación y cursos",
];

// Mapeo de íconos para cada categoría
const categoriaIconos: Record<string, React.ReactNode> = {
  "Todos": <FaList size={20} className="text-gray-500" />,
  "Comida casera": <FaUtensils size={20} className="text-red-500" />,
  "Pastelería": <GiCakeSlice size={20} className="text-pink-400" />,
  "Artesanías": <FaPaintBrush size={20} className="text-yellow-500" />,
  "Lencería": <FaTshirt size={20} className="text-pink-500" />,
  "Servicios técnicos": <FaHammer size={20} className="text-indigo-500" />,
  "Tecnología": <FaLaptopCode size={20} className="text-green-600" />,
  "Productos naturales": <FaLeaf size={20} className="text-emerald-500" />,
  "Productos para bebés": <FaBaby size={20} className="text-pink-400" />,
  "Moda y accesorios": <FaShoppingBag size={20} className="text-purple-600" />,
  "Deportes y outdoor": <FaBicycle size={20} className="text-cyan-500" />,
  "Educación y cursos": <FaBookOpen size={20} className="text-blue-500" />,
};

export default function EmprendedoresFiltrados() {
  const [emprendimientos, setEmprendimientos] = useState<Emprendimiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos");
  const [isMobile, setIsMobile] = useState(false);

  // Detectar tamaño de pantalla para el Swiper
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Traer emprendimientos de Firestore
  useEffect(() => {
    const fetchEmprendimientos = async () => {
      try {
        const q = query(collectionGroup(db, "emprendimientos"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Emprendimiento));
        setEmprendimientos(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmprendimientos();
  }, []);

  const emprendimientosFiltrados =
    categoriaSeleccionada === "Todos"
      ? emprendimientos
      : emprendimientos.filter((e) => e.categoria === categoriaSeleccionada);

  const renderCategoriaButton = (nombre: string) => (
    <button
      key={nombre}
      onClick={() => setCategoriaSeleccionada(nombre)}
      className={`bg-gray-100 rounded-xl shadow-sm flex flex-col items-center justify-center text-center hover:shadow-md hover:scale-105 transition-transform duration-150 w-20 h-20 ${
        categoriaSeleccionada === nombre ? "bg-indigo-100" : ""
      }`}
    >
      {categoriaIconos[nombre]}
      <span className="mt-1 text-xs text-gray-700 font-medium text-center px-1 leading-tight">{nombre}</span>
    </button>
  );

  if (loading) {
    return <p className="text-center mt-10 text-gray-500 animate-pulse">Cargando emprendedores...</p>;
  }

  return (
    <section id="emprendedores" className="py-12 bg-gray-50">
      {/* Carrusel de categorías */}
      <div className="text-center mb-10 px-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Nuestros Emprendedores</h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
          Descubrí personas reales, ideas auténticas y los productos o servicios que hacen crecer nuestra comunidad.
        </p>
      </div>

      <div className="max-w-6xl mx-auto mb-10" style={{ paddingLeft: 0, paddingRight: 0 }}>
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
          {categorias.map((nombre) => (
            <SwiperSlide key={nombre} style={{ width: "auto" }}>
              {renderCategoriaButton(nombre)}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Grid de emprendimientos */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-4">
        {emprendimientosFiltrados.length > 0 ? (
          emprendimientosFiltrados.map((emp) => (
            <div
              key={emp.id}
              className="bg-white rounded-3xl shadow-lg hover:shadow-2xl hover:scale-105 transition transform duration-300 overflow-hidden flex flex-col"
            >
              <div className="relative h-48 w-full">
                {emp.imageUrl ? ( // CAMBIO IMPORTANTE: Se usa 'imageUrl' en la condición
                  <Image src={emp.imageUrl} alt={emp.nombre} fill className="object-cover" />
                ) : (
                  <div className="h-48 w-full flex items-center justify-center bg-gray-100 text-gray-400 text-sm">
                    Sin imagen
                  </div>
                )}
              </div>

              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800">{emp.nombre}</h3>
                <span className="text-indigo-600 font-medium mt-1 text-sm sm:text-base">{emp.categoria}</span>
                <p className="mt-3 text-gray-600 text-sm sm:text-base flex-1">{emp.descripcion}</p>

                <div className="mt-4 flex items-center space-x-3 text-xl sm:text-2xl">
                  {emp.contacto && (
                    <a
                      href={`https://wa.me/${emp.contacto.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-500 hover:text-green-600 transition"
                    >
                      <FaWhatsapp />
                    </a>
                  )}
                  {emp.instagram && (
                    <a href={emp.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:text-pink-600 transition">
                      <FaInstagram />
                    </a>
                  )}
                  {emp.facebook && (
                    <a href={emp.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 transition">
                      <FaFacebookF />
                    </a>
                  )}
                  {emp.tiktok && (
                    <a href={emp.tiktok} target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-800 transition">
                      <FaTiktok />
                    </a>
                  )}
                  {emp.web && (
                    <a href={emp.web} target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:text-gray-900 transition">
                      <FaGlobe />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full mt-4">
            No hay emprendimientos en esta categoría.
          </p>
        )}
      </div>
    </section>
  );
}