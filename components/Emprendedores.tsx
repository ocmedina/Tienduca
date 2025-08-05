"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

type Props = {
  categoriaSeleccionada: string | null;
};

const emprendedores = [
  {
    id: 1,
    nombre: "Xime Natural",
    descripcion: "Cosmética natural y ecológica.",
    imagen: "/emprendedores/xime.jpg",
    whatsapp: "https://wa.me/5492611234567",
    categoriaId: "productos-naturales",
  },
  {
    id: 2,
    nombre: "Don Hugo Artesanías",
    descripcion: "Artesanías en madera hechas a mano.",
    imagen: "/emprendedores/donhugo.jpg",
    whatsapp: "https://wa.me/5492617654321",
    categoriaId: "artesanias",
  },
  {
    id: 3,
    nombre: "Pastelería Dulce Flor",
    descripcion: "Tortas, cupcakes y más.",
    imagen: "/emprendedores/pasteleria.jpg",
    whatsapp: "https://wa.me/5492619999999",
    categoriaId: "pasteleria",
  },
];

const Emprendedores = ({ categoriaSeleccionada }: Props) => {
  const filtrados = categoriaSeleccionada
    ? emprendedores.filter((e) => e.categoriaId === categoriaSeleccionada)
    : emprendedores;

  return (
    <section className="py-16 bg-white">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold">Nuestros emprendedores</h2>
        <p className="text-gray-600 mt-2">
          {categoriaSeleccionada
            ? "Emprendedores en esta categoría:"
            : "Personas reales, ideas auténticas. Conocé los productos y servicios de quienes hacen crecer nuestra comunidad."}
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        {filtrados.length > 0 ? (
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={20}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {filtrados.map((e) => (
              <SwiperSlide key={e.id}>
                <div className="bg-white rounded-xl shadow-md p-6 h-full flex flex-col items-center text-center">
                  <img
                    src={e.imagen}
                    alt={e.nombre}
                    className="w-32 h-32 rounded-full object-cover mb-4 border-2 border-green-500"
                  />
                  <h3 className="text-lg font-bold">{e.nombre}</h3>
                  <p className="text-gray-500 text-sm mt-1 mb-3">{e.descripcion}</p>
                  <a
                    href={e.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    Contactar por WhatsApp
                  </a>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <p className="text-center text-gray-500">No hay emprendedores en esta categoría todavía.</p>
        )}
      </div>
    </section>
  );
};

export default Emprendedores;
