"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { db } from "@/firebase/firebaseConfig";
import { collectionGroup, getDocs, query, orderBy } from "firebase/firestore";
import { FaWhatsapp, FaInstagram, FaFacebookF, FaTiktok, FaGlobe } from "react-icons/fa";

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
  imagen?: string;
};

export default function Emprendedores() {
  const [emprendimientos, setEmprendimientos] = useState<Emprendimiento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmprendimientos = async () => {
      try {
        const q = query(collectionGroup(db, "emprendimientos"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Emprendimiento)
        );
        setEmprendimientos(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmprendimientos();
  }, []);

  if (loading) {
    return <p className="text-center mt-10 text-gray-500 animate-pulse">Cargando emprendedores...</p>;
  }

  return (
    <section className="py-12 bg-gray-50">
      {/* Título general */}
      <div className="text-center mb-10 px-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Nuestros Emprendedores</h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
          Descubrí personas reales, ideas auténticas y los productos o servicios que hacen crecer nuestra comunidad.
        </p>
      </div>

      {/* Grid de tarjetas */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-4">
        {emprendimientos.map((emp) => (
          <div
            key={emp.id}
            className="bg-white rounded-3xl shadow-lg hover:shadow-2xl hover:scale-105 transition transform duration-300 overflow-hidden flex flex-col"
          >
            {/* Imagen */}
            <div className="relative h-48 w-full">
              {emp.imagen ? (
                <Image
                  src={emp.imagen}
                  alt={emp.nombre}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              ) : (
                <div className="h-48 w-full flex items-center justify-center bg-gray-100 text-gray-400 text-sm">
                  Sin imagen
                </div>
              )}
            </div>

            {/* Contenido */}
            <div className="p-5 flex flex-col flex-1">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">{emp.nombre}</h3>
              <span className="text-indigo-600 font-medium mt-1 text-sm sm:text-base">{emp.categoria}</span>
              <p className="mt-3 text-gray-600 text-sm sm:text-base flex-1">{emp.descripcion}</p>

              {/* Redes sociales */}
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
                  <a
                    href={emp.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-500 hover:text-pink-600 transition"
                  >
                    <FaInstagram />
                  </a>
                )}
                {emp.facebook && (
                  <a
                    href={emp.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 transition"
                  >
                    <FaFacebookF />
                  </a>
                )}
                {emp.tiktok && (
                  <a
                    href={emp.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black hover:text-gray-800 transition"
                  >
                    <FaTiktok />
                  </a>
                )}
                {emp.web && (
                  <a
                    href={emp.web}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-800 hover:text-gray-900 transition"
                  >
                    <FaGlobe />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
