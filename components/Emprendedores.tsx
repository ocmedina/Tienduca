"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { db } from "@/firebase/firebaseConfig";
import { collectionGroup, getDocs, query, orderBy } from "firebase/firestore";

type Emprendimiento = {
  id: string;
  nombre: string;
  categoria: string;
  descripcion: string;
  contacto: string;
  imagen?: string;
};

export default function Emprendedores() {
  const [emprendimientos, setEmprendimientos] = useState<Emprendimiento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmprendimientos = async () => {
      try {
        const q = query(
          collectionGroup(db, "emprendimientos"),
          orderBy("createdAt", "desc")
        );
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
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900">Emprendimientos Destacados</h2>
        <p className="text-gray-600 mt-2">Conoce los emprendimientos de nuestra comunidad</p>
      </div>

      {/* Grid de tarjetas */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
        {emprendimientos.map((emp) => (
          <div
            key={emp.id}
            className="bg-white rounded-3xl shadow-md hover:shadow-2xl hover:scale-105 transition transform duration-300 overflow-hidden border border-gray-200 flex flex-col"
          >
            {/* Imagen */}
            <div className="relative h-40 w-full">
              {emp.imagen ? (
                <Image
                  src={emp.imagen}
                  alt={emp.nombre}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              ) : (
                <div className="h-40 w-full flex items-center justify-center bg-gray-100 text-gray-400 text-sm">
                  Sin imagen
                </div>
              )}
            </div>

            {/* Contenido */}
            <div className="p-5 flex flex-col flex-1">
              <h3 className="font-bold text-lg text-gray-800">{emp.nombre}</h3>
              <span className="text-indigo-600 text-sm font-medium mt-1">{emp.categoria}</span>
              <p className="mt-3 text-gray-600 text-sm flex-1">{emp.descripcion}</p>
              
              <div className="mt-4 flex items-center justify-between">
                <span className="text-gray-500 text-sm">📞 {emp.contacto}</span>
                <button className="px-3 py-1 bg-indigo-500 text-white rounded-xl text-sm shadow hover:bg-indigo-600 transition">
                  Ver más
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
