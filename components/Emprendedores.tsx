"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { db } from "@/firebase/firebaseConfig";
import { collectionGroup, getDocs, query, orderBy, limit, startAfter, where, DocumentSnapshot } from "firebase/firestore";
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
  FaDog,
  FaGlassMartiniAlt,
  FaHome,
  FaHeartbeat,
  FaCamera,
  FaStore,
  FaMapMarkerAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { FaScissors } from "react-icons/fa6";
import { GiCakeSlice, GiMeat } from "react-icons/gi";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";

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
  imageUrl?: string;
  ubicacion?: string;
  createdAt?: { toDate: () => Date };
};

const categorias = [
  "Todos",
  "Comida casera",
  "Pastelería",
  "Bebidas",
  "Carnicerías",
  "Artesanías",
  "Hogar y decoración",
  "Moda y accesorios",
  "Lencería",
  "Productos para bebés",
  "Peluquerías",
  "Drugstores",
  "Locales comerciales",
  "Servicios técnicos",
  "Tecnología",
  "Productos naturales",
  "Mascotas",
  "Deportes y outdoor",
  "Salud y bienestar",
  "Fotografía y arte",
  "Educación y cursos",
];

const categoriaIconos: Record<string, React.ReactNode> = {
  "Todos": <FaList size={20} className="text-gray-500" />,
  "Comida casera": <FaUtensils size={20} className="text-red-500" />,
  "Pastelería": <GiCakeSlice size={20} className="text-pink-400" />,
  "Bebidas": <FaGlassMartiniAlt size={20} className="text-purple-500" />,
  "Carnicerías": <GiMeat size={20} className="text-red-600" />,
  "Artesanías": <FaPaintBrush size={20} className="text-yellow-500" />,
  "Hogar y decoración": <FaHome size={20} className="text-orange-500" />,
  "Moda y accesorios": <FaShoppingBag size={20} className="text-purple-600" />,
  "Lencería": <FaTshirt size={20} className="text-pink-500" />,
  "Productos para bebés": <FaBaby size={20} className="text-pink-400" />,
  "Peluquerías": <FaScissors size={20} className="text-fuchsia-600" />,
  "Drugstores": <FaStore size={20} className="text-sky-500" />,
  "Locales comerciales": <FaStore size={20} className="text-sky-500" />,
  "Servicios técnicos": <FaHammer size={20} className="text-indigo-500" />,
  "Tecnología": <FaLaptopCode size={20} className="text-green-600" />,
  "Productos naturales": <FaLeaf size={20} className="text-emerald-500" />,
  "Mascotas": <FaDog size={20} className="text-yellow-700" />,
  "Deportes y outdoor": <FaBicycle size={20} className="text-cyan-500" />,
  "Salud y bienestar": <FaHeartbeat size={20} className="text-rose-500" />,
  "Fotografía y arte": <FaCamera size={20} className="text-gray-700" />,
  "Educación y cursos": <FaBookOpen size={20} className="text-blue-500" />,
};

const ITEMS_PER_PAGE = 12;

export default function EmprendedoresFiltrados() {
  const [emprendimientos, setEmprendimientos] = useState<Emprendimiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos");
  const [isMobile, setIsMobile] = useState(false);
  const [lastVisible, setLastVisible] = useState<DocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchEmprendimientos = async (loadMore = false) => {
    setLoading(true);
    try {
      let baseQuery = query(
        collectionGroup(db, "emprendimientos"),
        orderBy("createdAt", "desc")
      );

      if (categoriaSeleccionada !== "Todos") {
        baseQuery = query(baseQuery, where("categoria", "==", categoriaSeleccionada));
      }

      const paginatedQuery = loadMore && lastVisible
        ? query(baseQuery, startAfter(lastVisible), limit(ITEMS_PER_PAGE))
        : query(baseQuery, limit(ITEMS_PER_PAGE));

      const snapshot = await getDocs(paginatedQuery);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Emprendimiento[];

      setEmprendimientos((prev) => (loadMore ? [...prev, ...data] : data));
      setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.docs.length === ITEMS_PER_PAGE);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  };

  useEffect(() => {
    fetchEmprendimientos(false);
  }, [categoriaSeleccionada]);

  const handleCargarMas = () => {
    fetchEmprendimientos(true);
  };

  const handleSelectCategoria = (nombre: string) => {
    if (nombre !== categoriaSeleccionada) {
      setCategoriaSeleccionada(nombre);
      setEmprendimientos([]);
      setLastVisible(null);
      setHasMore(true);
    }
  };

  const renderCategoriaButton = (nombre: string) => (
    <button
      key={nombre}
      onClick={() => handleSelectCategoria(nombre)}
      className={`bg-gray-100 rounded-xl shadow-sm flex flex-col items-center justify-center text-center hover:shadow-md hover:scale-105 transition-transform duration-150 w-20 h-20 ${
        categoriaSeleccionada === nombre ? "bg-indigo-100" : ""
      }`}
    >
      {categoriaIconos[nombre]}
      <span className="mt-1 text-xs text-gray-700 font-medium text-center px-1 leading-tight">{nombre}</span>
    </button>
  );

  const renderEmprendimientos = (emprendimientosList: Emprendimiento[]) => (
    emprendimientosList.length > 0 ? (
      emprendimientosList.map((emp) => (
        <div
          key={emp.id}
          className="bg-white rounded-3xl shadow-lg hover:shadow-2xl hover:scale-105 transition transform duration-300 flex flex-col h-full"
        >
          <div className="relative h-48 w-full overflow-hidden rounded-t-3xl">
            {emp.imageUrl ? (
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
            {/* INICIO DE CÓDIGO CORREGIDO */}
            {emp.createdAt && (
              <p className="mt-1 text-gray-500 text-xs">
                {emp.createdAt.toDate().toLocaleDateString("es-AR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}
            {/* FIN DE CÓDIGO CORREGIDO */}
            <p className="mt-3 text-gray-600 text-sm sm:text-base flex-1">{emp.descripcion}</p>
            {emp.ubicacion && (
                <p className="mt-2 text-gray-500 text-sm flex items-center gap-2">
                    <FaMapMarkerAlt className="text-base text-red-500" />
                    {emp.ubicacion}
                </p>
            )}
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
      !isInitialLoad && (
        <p className="text-center text-gray-500 col-span-full mt-4">
          No hay emprendimientos en esta categoría.
        </p>
      )
    )
  );

  return (
    <section id="emprendedores" className="py-12 bg-gray-50">
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

      <div className="max-w-7xl mx-auto relative">
        {/* INICIO DEL INDICADOR DE CARGA */}
        {loading && emprendimientos.length === 0 && (
          <div className="flex justify-center items-center py-10">
            <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.002 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="ml-4 text-gray-600 font-medium">Cargando emprendimientos...</span>
          </div>
        )}
        {/* FIN DEL INDICADOR DE CARGA */}

        {categoriaSeleccionada === "Todos" ? (
          <Swiper
            modules={[FreeMode, Navigation]}
            spaceBetween={20}
            slidesPerView={1.2}
            freeMode={true}
            navigation={{
              nextEl: ".swiper-button-next-custom",
              prevEl: ".swiper-button-prev-custom",
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 30,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 40,
              },
            }}
            className="pb-4 px-4"
          >
            {emprendimientos.length > 0 ? (
              emprendimientos.map((emp) => (
                <SwiperSlide key={emp.id} className="h-full relative group z-0" style={{ overflow: 'visible' }}>
                  <div className="bg-white rounded-3xl shadow-lg group-hover:shadow-2xl group-hover:scale-105 transition transform duration-300 flex flex-col h-full relative z-0 group-hover:z-10">
                    <div className="relative h-48 w-full overflow-hidden rounded-t-3xl">
                      {emp.imageUrl ? (
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
                      {/* INICIO DE CÓDIGO CORREGIDO */}
                      {emp.createdAt && (
                        <p className="mt-1 text-gray-500 text-xs">
                          {emp.createdAt.toDate().toLocaleDateString("es-AR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      )}
                      {/* FIN DE CÓDIGO CORREGIDO */}
                      <p className="mt-3 text-gray-600 text-sm sm:text-base flex-1">{emp.descripcion}</p>
                      {emp.ubicacion && (
                        <p className="mt-2 text-gray-500 text-sm flex items-center gap-2">
                          <FaMapMarkerAlt className="text-base text-red-500" />
                          {emp.ubicacion}
                        </p>
                      )}
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
                </SwiperSlide>
              ))
            ) : (
              !isInitialLoad && (
                <SwiperSlide>
                  <p className="text-center text-gray-500 col-span-full mt-4">
                    No hay emprendimientos en esta categoría.
                  </p>
                </SwiperSlide>
              )
            )}
          </Swiper>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-4">
            {renderEmprendimientos(emprendimientos)}
          </div>
        )}
        {categoriaSeleccionada === "Todos" && (
          <>
            <div className="swiper-button-prev-custom absolute top-1/2 -left-4 transform -translate-y-1/2 p-3 rounded-full bg-white shadow-md text-gray-700 hover:bg-gray-100 transition duration-200 z-10 cursor-pointer hidden md:flex items-center justify-center">
              <FaChevronLeft size={20} />
            </div>
            <div className="swiper-button-next-custom absolute top-1/2 -right-4 transform -translate-y-1/2 p-3 rounded-full bg-white shadow-md text-gray-700 hover:bg-gray-100 transition duration-200 z-10 cursor-pointer hidden md:flex items-center justify-center">
              <FaChevronRight size={20} />
            </div>
          </>
        )}
      </div>

      {hasMore && !loading && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleCargarMas}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-full font-bold shadow-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
          >
            {loading ? "Cargando..." : "Cargar más"}
          </button>
        </div>
      )}
    </section>
  );
}