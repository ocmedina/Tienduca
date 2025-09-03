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
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { FaInstagram, FaFacebook, FaTiktok, FaWhatsapp, FaGlobe, FaImage, FaTimesCircle } from "react-icons/fa"; // Se añadió FaImage y FaTimesCircle

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
  imageUrl?: string; // Nuevo campo para la URL de la imagen
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
  const [editingEmp, setEditingEmp] = useState<Emprendimiento | null>(null);

  // Estados formulario
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [contacto, setContacto] = useState("");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [web, setWeb] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null); // Estado para el archivo de imagen seleccionado
  const [imageUrlPreview, setImageUrlPreview] = useState<string | null>(null); // Estado para la previsualización de la imagen
  const [subiendo, setSubiendo] = useState(false);

  // Configuración de Cloudinary (¡Reemplaza con tus datos!)
  const CLOUDINARY_CLOUD_NAME = "dkqqhbble"; // Reemplaza esto con tu Cloud Name
  const CLOUDINARY_UPLOAD_PRESET = "ocmedina"; // Reemplaza esto con el nombre de tu upload preset (sin firmar)

  // Función para formatear WhatsApp
  const formatWhatsApp = (numero: string) => {
    let clean = numero.replace(/\D/g, "");
    if (clean.startsWith("0")) clean = clean.slice(1);
    if (!clean.startsWith("54")) clean = "54" + clean;
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

  // Función para subir la imagen a Cloudinary
  const uploadImageToCloudinary = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      if (data.secure_url) {
        return data.secure_url;
      } else {
        console.error("Error al subir imagen a Cloudinary:", data);
        return null;
      }
    } catch (error) {
      console.error("Error en la solicitud a Cloudinary:", error);
      return null;
    }
  };

  // Subir nuevo emprendimiento o actualizar existente
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Debes estar logueado para crear o editar un emprendimiento.");
      return;
    }
    if (!nombre || !categoria || !descripcion || !contacto) {
      alert("Completa todos los campos obligatorios.");
      return;
    }
    setSubiendo(true);

    let finalImageUrl = editingEmp?.imageUrl || null; // Mantener la imagen existente por defecto

    if (imageFile) {
      // Si hay un nuevo archivo de imagen, subirlo
      const uploadedUrl = await uploadImageToCloudinary(imageFile);
      if (uploadedUrl) {
        finalImageUrl = uploadedUrl;
      } else {
        alert("Error al subir la imagen. Intenta de nuevo.");
        setSubiendo(false);
        return;
      }
    } else if (imageUrlPreview === null && editingEmp?.imageUrl) {
        // Si se eliminó la previsualización de una imagen existente
        finalImageUrl = null;
    }

    try {
      if (editingEmp) {
        // Modo Edición
        await updateDoc(doc(db, "users", user.uid, "emprendimientos", editingEmp.id), {
          nombre,
          categoria,
          descripcion,
          contacto: formatWhatsApp(contacto),
          instagram,
          facebook,
          tiktok,
          web,
          imageUrl: finalImageUrl,
        });
      } else {
        // Modo Creación
        await addDoc(collection(db, "users", user.uid, "emprendimientos"), {
          nombre,
          categoria,
          descripcion,
          contacto: formatWhatsApp(contacto),
          instagram,
          facebook,
          tiktok,
          web,
          imageUrl: finalImageUrl,
          createdAt: serverTimestamp(),
        });
      }

      handleCancelEdit(); // Limpia el formulario y el estado de edición
      setRefresh(!refresh); // Fuerza la recarga de la lista
    } catch (err) {
      console.error(err);
      alert("Error al guardar el emprendimiento.");
    } finally {
      setSubiendo(false);
    }
  };

  // Manejar el cambio de archivo de imagen
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImageUrlPreview(URL.createObjectURL(file)); // Crear una URL para previsualizar
    } else {
      setImageFile(null);
      setImageUrlPreview(null);
    }
  };

  // Eliminar la imagen previsualizada o la imagen existente en edición
  const handleRemoveImage = () => {
    setImageFile(null);
    setImageUrlPreview(null);
    // Si estamos editando y eliminamos la imagen, también la quitamos del editingEmp
    if (editingEmp) {
      setEditingEmp({ ...editingEmp, imageUrl: undefined });
    }
  };


  // Llenar el formulario para editar
  const handleEdit = (emp: Emprendimiento) => {
    setEditingEmp(emp);
    setNombre(emp.nombre);
    setCategoria(emp.categoria);
    setDescripcion(emp.descripcion);
    setContacto(emp.contacto);
    setInstagram(emp.instagram || "");
    setFacebook(emp.facebook || "");
    setTiktok(emp.tiktok || "");
    setWeb(emp.web || "");
    setImageFile(null); // Resetear el archivo seleccionado al editar
    setImageUrlPreview(emp.imageUrl || null); // Mostrar la imagen existente si hay
  };

  // Cancelar la edición
  const handleCancelEdit = () => {
    setEditingEmp(null);
    setNombre("");
    setCategoria("");
    setDescripcion("");
    setContacto("");
    setInstagram("");
    setFacebook("");
    setTiktok("");
    setWeb("");
    setImageFile(null);
    setImageUrlPreview(null);
  };

  // Eliminar emprendimiento
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
    return <p className="text-center mt-20 text-gray-500 text-xl font-medium animate-pulse">Cargando...</p>;
  }

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="max-w-3xl mx-auto p-4 space-y-8 relative">

        {/* Botón para volver a la página principal */}
{/* Botón para volver a la página principal */}
<button
  onClick={() => router.push('/')}
  className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-gray-800 bg-yellow-400 shadow-md hover:bg-yellow-500 transition-colors duration-200"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 19l-7-7 7-7"
    />
  </svg>
  Volver
</button>

      

        {/* Sección Perfil */}
        <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white p-8 rounded-3xl shadow-xl text-center">
          <div className="flex justify-center items-center mb-4">
            <h2 className="text-3xl font-bold tracking-wide">
              Hola, <span className="text-yellow-400">{user.displayName || "Usuario"}</span>! 👋
            </h2>
          </div>
          <p className="text-gray-300 font-light text-lg">Email: {user.email}</p>
        </div>

        {/* Formulario de Emprendimiento (Crear/Editar) */}
        <div className="bg-white p-8 rounded-3xl shadow-xl space-y-6">
          <h3 className="text-2xl font-bold text-center text-gray-800">
            {editingEmp ? "Edita tu Emprendimiento" : "Crea tu Emprendimiento"}
          </h3>
          <p className="text-center text-gray-500 mb-6">
            {editingEmp
              ? "Modifica la información de tu negocio y guarda los cambios."
              : "Completa el formulario para agregar tu negocio a la plataforma."}
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Nombre del emprendimiento"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-700 transition-all duration-200"
              required
            />
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-700 transition-all duration-200"
              required
            >
              <option value="">Selecciona una categoría</option>
              {categorias.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <textarea
              placeholder="Descripción del producto o servicio"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-3 h-32 focus:outline-none focus:ring-2 focus:ring-blue-700 resize-none transition-all duration-200"
              required
            />
            <input
              type="text"
              placeholder="Número de contacto (WhatsApp)"
              value={contacto}
              onChange={(e) => setContacto(e.target.value)}
              onBlur={() => setContacto(formatWhatsApp(contacto))}
              className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-700 transition-all duration-200"
              required
            />

            {/* Campo de subida de imagen */}
            <label className="block text-gray-700 text-sm font-bold mb-2">Imagen del Emprendimiento (opcional)</label>
            <div className="flex items-center space-x-4">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-blue-50 file:text-blue-700
                                hover:file:bg-blue-100"
                />
                {(imageUrlPreview || (editingEmp && editingEmp.imageUrl)) && (
                    <div className="relative w-24 h-24">
                        <img
                            src={imageUrlPreview || editingEmp?.imageUrl}
                            alt="Previsualización"
                            className="w-full h-full object-cover rounded-md border border-gray-300"
                        />
                        <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                            aria-label="Eliminar imagen"
                        >
                            <FaTimesCircle className="text-lg" />
                        </button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Enlace a Instagram"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-200"
              />
              <input
                type="text"
                placeholder="Enlace a Facebook"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-200"
              />
              <input
                type="text"
                placeholder="Enlace a TikTok"
                value={tiktok}
                onChange={(e) => setTiktok(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-800 transition-all duration-200"
              />
              <input
                type="text"
                placeholder="Enlace a tu sitio web"
                value={web}
                onChange={(e) => setWeb(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-700 transition-all duration-200"
              />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={subiendo}
                className={`flex-1 py-4 rounded-xl font-bold shadow-lg transition-colors duration-300 transform hover:scale-[1.02] ${
                  subiendo ? "bg-gray-400 cursor-not-allowed text-white" : "bg-yellow-400 hover:bg-yellow-500 text-gray-800"
                }`}
              >
                {subiendo ? "Guardando..." : (editingEmp ? "Guardar Cambios" : "Crear Emprendimiento")}
              </button>
              {editingEmp && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="py-4 px-6 rounded-xl font-bold shadow-lg text-gray-600 border border-gray-300 transition-colors duration-300 hover:bg-gray-200"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Lista de emprendimientos */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-gray-800">Mis Emprendimientos ✨</h3>
          {emprendimientos.length === 0 ? (
            <p className="text-gray-500 text-center text-lg py-10">Aún no tienes emprendimientos registrados. ¡Anímate a crear uno!</p>
          ) : (
            <div className="grid gap-4">
              {emprendimientos.map((emp) => (
                <div
                  key={emp.id}
                  onClick={() => handleEdit(emp)}
                  className="bg-white p-6 rounded-3xl shadow-md flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 transition-all duration-300 hover:shadow-xl hover:scale-[1.01] border-l-4 border-yellow-400 cursor-pointer"
                >
                  <div className="flex-1">
                    <h4 className="font-bold text-xl text-blue-800">{emp.nombre}</h4>
                    <p className="text-yellow-600 font-medium text-sm mt-1">{emp.categoria}</p>
                    {emp.imageUrl && ( // Mostrar imagen si existe
                        <img
                            src={emp.imageUrl}
                            alt={`Imagen de ${emp.nombre}`}
                            className="w-32 h-32 object-cover rounded-md mt-3 mb-4 shadow-sm"
                        />
                    )}
                    <p className="text-gray-600 mt-2 text-sm leading-relaxed">{emp.descripcion}</p>
                    <div className="flex gap-4 mt-4 text-gray-500 flex-wrap">
                      {emp.contacto && (
                        <a
                          href={`https://wa.me/${emp.contacto.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 hover:text-green-500 transition-colors"
                        >
                          <FaWhatsapp className="text-lg" /> WhatsApp
                        </a>
                      )}
                      {emp.instagram && (
                        <a
                          href={emp.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 hover:text-pink-600 transition-colors"
                        >
                          <FaInstagram className="text-lg" /> Instagram
                        </a>
                      )}
                      {emp.facebook && (
                        <a
                          href={emp.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 hover:text-blue-700 transition-colors"
                        >
                          <FaFacebook className="text-lg" /> Facebook
                        </a>
                      )}
                      {emp.tiktok && (
                        <a
                          href={emp.tiktok}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 hover:text-gray-800 transition-colors"
                        >
                          <FaTiktok className="text-lg" /> TikTok
                        </a>
                      )}
                      {emp.web && (
                        <a
                          href={emp.web}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 hover:text-gray-900 transition-colors"
                        >
                          <FaGlobe className="text-lg" /> Web
                        </a>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(emp.id);
                    }}
                    className="mt-4 sm:mt-0 px-5 py-2 bg-red-500 text-white rounded-full text-sm font-semibold shadow-md hover:bg-red-600 transition-all duration-300 transform hover:scale-105"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sección Quiénes somos */}
        <div className="bg-gradient-to-br from-blue-700 to-blue-900 text-white p-8 rounded-3xl shadow-xl text-center">
          <h3 className="text-2xl font-bold mb-2 tracking-wide">¿Quiénes somos?</h3>
          <p className="text-gray-300 font-light leading-relaxed">
            Somos una plataforma que conecta emprendedores con clientes, promoviendo ideas auténticas y productos de calidad.
            Nuestro objetivo es que cada emprendimiento tenga la visibilidad que merece.
          </p>
        </div>
      </div>
    </div>
  );
}