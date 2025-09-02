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
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/firebase/firebaseConfig";

type Emprendimiento = {
  id: string;
  nombre: string;
  categoria: string;
  descripcion: string;
  contacto: string;
  imagen?: string;
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

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [emprendimientos, setEmprendimientos] = useState<Emprendimiento[]>([]);
  const [refresh, setRefresh] = useState(false);

  // Estados del formulario
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [contacto, setContacto] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [subiendo, setSubiendo] = useState(false);

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
    if (!nombre || !categoria || !descripcion || !contacto) {
      alert("Completa todos los campos");
      return;
    }
    setSubiendo(true);
    try {
      let imageUrl = "";
      if (file && user) {
        const storageRef = ref(storage, `logos/${user.uid}-${file.name}`);
        await uploadBytes(storageRef, file);
        imageUrl = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, "users", user!.uid, "emprendimientos"), {
        nombre,
        categoria,
        descripcion,
        contacto,
        imagen: imageUrl,
        createdAt: serverTimestamp(),
      });

      setNombre("");
      setCategoria("");
      setDescripcion("");
      setContacto("");
      setFile(null);
      setRefresh(!refresh);
    } catch (err) {
      console.error(err);
      alert("Error al subir el emprendimiento");
    } finally {
      setSubiendo(false);
    }
  };

  // Eliminar emprendimiento
  const handleDelete = async (id: string) => {
    const confirm = window.confirm("¿Seguro querés eliminar este emprendimiento?");
    if (!confirm) return;
    try {
      await deleteDoc(doc(db, "users", user!.uid, "emprendimientos", id));
      setRefresh(!refresh);
    } catch (err) {
      console.error(err);
      alert("Error al eliminar el emprendimiento");
    }
  };

  if (loading || !user)
    return <p className="text-center mt-10 text-gray-500 animate-pulse">Cargando...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Info usuario */}
      <div className="bg-white p-6 rounded-2xl shadow mb-6">
        <h2 className="text-2xl font-semibold mb-2">
          Hola, {user.displayName || "Usuario"}
        </h2>
        <p className="text-gray-600">Email: {user.email}</p>
      </div>

      {/* Formulario */}
      <div className="bg-white p-6 rounded-2xl shadow mb-8">
        <h3 className="text-xl font-semibold mb-4">Agregar nuevo emprendimiento</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Seleccionar categoría</option>
            {categorias.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <textarea
            placeholder="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
          <input
            type="text"
            placeholder="Contacto"
            value={contacto}
            onChange={(e) => setContacto(e.target.value)}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="border rounded-lg px-4 py-2"
          />
          <button
            type="submit"
            disabled={subiendo}
            className="bg-indigo-500 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-600 transition"
          >
            {subiendo ? "Subiendo..." : "Agregar"}
          </button>
        </form>
      </div>

      {/* Lista de emprendimientos */}
      <h3 className="text-xl font-semibold mb-4">Mis Emprendimientos</h3>
      {emprendimientos.length === 0 ? (
        <p className="text-gray-500">No tienes emprendimientos aún.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {emprendimientos.map((emp) => (
            <div
              key={emp.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden border border-gray-200 flex flex-col hover:scale-105 transform duration-200"
            >
              {emp.imagen ? (
                <img src={emp.imagen} alt={emp.nombre} className="h-32 w-full object-cover" />
              ) : (
                <div className="h-32 w-full flex items-center justify-center bg-gray-100 text-gray-400 text-sm">
                  Sin imagen
                </div>
              )}

              <div className="p-4 flex flex-col flex-1">
                <h4 className="font-semibold text-lg text-gray-800">{emp.nombre}</h4>
                <p className="text-indigo-600 text-sm font-medium">{emp.categoria}</p>
                <p className="mt-2 text-gray-600 flex-1">{emp.descripcion}</p>
                <p className="mt-3 font-medium text-blue-600">📞 {emp.contacto}</p>
                <button
                  onClick={() => handleDelete(emp.id)}
                  className="mt-3 px-3 py-1 bg-red-500 text-white rounded-lg text-xs shadow hover:bg-red-600 transition self-start"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
