"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { FaInstagram, FaFacebook, FaTiktok, FaWhatsapp } from "react-icons/fa";

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
};

const categorias = [
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

export default function Perfil() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [emprendimientos, setEmprendimientos] = useState<Emprendimiento[]>([]);
  const [refresh, setRefresh] = useState(false);

  // Estados formulario
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [contacto, setContacto] = useState("");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [web, setWeb] = useState("");
  const [subiendo, setSubiendo] = useState(false);

  // Función para formatear WhatsApp
  const formatWhatsApp = (numero: string) => {
    let clean = numero.replace(/\D/g, ""); // quitar todo menos números
    if (clean.startsWith("0")) clean = clean.slice(1); // quitar cero inicial
    if (!clean.startsWith("54")) clean = "54" + clean; // agregar código de país (Argentina)
    return clean;
  };

  // Protege la ruta
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Traer emprendimientos
  useEffect(() => {
    const fetchEmprendimientos = async () => {
      if (!user) return;
      try {
        const q = query(
          collection(db, "users", user.uid, "emprendimientos"),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Emprendimiento[];
        setEmprendimientos(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEmprendimientos();
  }, [user, refresh]);

  // Subir nuevo emprendimiento
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Debés estar logueado para crear un emprendimiento");
      return;
    }
    if (!nombre || !categoria || !descripcion || !contacto) {
      alert("Completa todos los campos obligatorios");
      return;
    }
    setSubiendo(true);
    try {
      await addDoc(collection(db, "users", user.uid, "emprendimientos"), {
        nombre,
        categoria,
        descripcion,
        contacto: formatWhatsApp(contacto),
        instagram,
        facebook,
        tiktok,
        web,
        createdAt: serverTimestamp(),
      });

      // Reset
      setNombre("");
      setCategoria("");
      setDescripcion("");
      setContacto("");
      setInstagram("");
      setFacebook("");
      setTiktok("");
      setWeb("");
      setRefresh(!refresh);
    } catch (err) {
      console.error(err);
      alert("Error al crear emprendimiento");
    } finally {
      setSubiendo(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro querés eliminar este emprendimiento?")) return;
    try {
      await deleteDoc(doc(db, "users", user!.uid, "emprendimientos", id));
      setRefresh(!refresh);
    } catch (err) {
      console.error(err);
      alert("Error al eliminar el emprendimiento");
    }
  };

  if (loading || !user) {
    return <p className="text-center mt-10 text-gray-500 animate-pulse">Cargando...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-8">
      {/* Sección Perfil */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-6 rounded-2xl shadow text-center">
        <h2 className="text-2xl font-semibold mb-2">
          Hola, {user.displayName || "Usuario"}
        </h2>
        <p className="text-gray-200 mb-2">Email: {user.email}</p>
      </div>

      {/* Formulario nuevo emprendimiento */}
      <div className="bg-white p-6 rounded-2xl shadow space-y-4">
        <h3 className="text-xl font-semibold text-center">Agregar nuevo emprendimiento</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          >
            <option value="">Seleccionar categoría</option>
            {categorias.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <textarea
            placeholder="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            required
          />
          <input
            type="text"
            placeholder="Contacto (WhatsApp)"
            value={contacto}
            onChange={(e) => setContacto(e.target.value)}
            onBlur={() => setContacto(formatWhatsApp(contacto))}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <div className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="Instagram"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="Facebook"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="TikTok"
              value={tiktok}
              onChange={(e) => setTiktok(e.target.value)}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="Web"
              value={web}
              onChange={(e) => setWeb(e.target.value)}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            disabled={subiendo}
            className={`w-full py-3 rounded-xl text-white font-semibold shadow-lg transition-colors ${
              subiendo ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-500 hover:bg-indigo-600"
            }`}
          >
            {subiendo ? "Guardando..." : "Crear Emprendimiento"}
          </button>
        </form>
      </div>

      {/* Lista de emprendimientos */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Mis Emprendimientos</h3>
        {emprendimientos.length === 0 ? (
          <p className="text-gray-500">No tienes emprendimientos aún.</p>
        ) : (
          <div className="space-y-4">
            {emprendimientos.map((emp) => (
              <div
                key={emp.id}
                className="bg-white p-4 rounded-2xl shadow flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-3"
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-lg">{emp.nombre}</h4>
                  <p className="text-indigo-600 text-sm">{emp.categoria}</p>
                  <p className="text-gray-600 mt-1">{emp.descripcion}</p>
                  <div className="flex gap-2 mt-2 text-blue-600 flex-wrap">
                    {emp.contacto && (
                      <a
                        href={`https://wa.me/${emp.contacto.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:underline"
                      >
                        <FaWhatsapp /> WhatsApp
                      </a>
                    )}
                    {emp.instagram && (
                      <a
                        href={emp.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:underline"
                      >
                        <FaInstagram /> IG
                      </a>
                    )}
                    {emp.facebook && (
                      <a
                        href={emp.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:underline"
                      >
                        <FaFacebook /> FB
                      </a>
                    )}
                    {emp.tiktok && (
                      <a
                        href={emp.tiktok}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:underline"
                      >
                        <FaTiktok /> TikTok
                      </a>
                    )}
                    {emp.web && (
                      <a
                        href={emp.web}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:underline"
                      >
                        🌐 Web
                      </a>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(emp.id)}
                  className="mt-2 sm:mt-0 px-3 py-1 bg-red-500 text-white rounded-lg text-xs shadow hover:bg-red-600 transition self-start"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sección Quiénes somos */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-2xl shadow text-center">
        <h3 className="text-xl font-semibold mb-2">Quiénes somos</h3>
        <p className="text-gray-200">
          Somos una plataforma que conecta emprendedores con clientes, promoviendo ideas auténticas y productos de calidad.
          Nuestro objetivo es que cada emprendimiento tenga la visibilidad que merece.
        </p>
      </div>
    </div>
  );
}
