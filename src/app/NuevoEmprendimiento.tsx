"use client";
import { useState } from "react";
import { db } from "@/firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { User } from "firebase/auth";

type Props = {
  user: User;
};

export default function NuevoEmprendimiento({ user }: Props) {
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [contacto, setContacto] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Guardar el emprendimiento dentro del usuario
      await addDoc(collection(db, "users", user.uid, "emprendimientos"), {
        nombre,
        categoria,
        descripcion,
        contacto,
        createdAt: new Date(),
      });

      alert("Emprendimiento creado con éxito 🚀");
      setNombre("");
      setCategoria("");
      setDescripcion("");
      setContacto("");
    } catch (err) {
      console.error(err);
      alert("Error al crear emprendimiento");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded shadow-lg mt-10">
      <h2 className="text-xl font-semibold mb-4 text-center">Nuevo Emprendimiento</h2>

      <input type="text" placeholder="Nombre" value={nombre} onChange={(e)=>setNombre(e.target.value)} className="w-full border px-4 py-2 rounded mb-3" required />
      <input type="text" placeholder="Categoría" value={categoria} onChange={(e)=>setCategoria(e.target.value)} className="w-full border px-4 py-2 rounded mb-3" required />
      <textarea placeholder="Descripción" value={descripcion} onChange={(e)=>setDescripcion(e.target.value)} className="w-full border px-4 py-2 rounded mb-3" required />
      <input type="text" placeholder="Contacto" value={contacto} onChange={(e)=>setContacto(e.target.value)} className="w-full border px-4 py-2 rounded mb-3" required />

      <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
        {loading ? "Guardando..." : "Crear"}
      </button>
    </form>
  );
}
