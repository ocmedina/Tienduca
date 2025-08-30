"use client";

import { useEffect, useState } from "react";
import { getAuth, User, onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

// Asumiendo que `auth` se inicializa en otro lugar
const auth = getAuth();

export default function PerfilPage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm border border-gray-200">
        <div className="text-center mb-6">
          {/* Aquí podrías agregar una imagen de perfil si la tuvieras */}
          <div className="mx-auto bg-gray-300 rounded-full h-24 w-24 flex items-center justify-center text-3xl text-gray-700">
            {user.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mt-4">
            {user.displayName || "Usuario"}
          </h1>
        </div>
        
        <div className="space-y-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-semibold text-gray-500">Email</p>
            <p className="text-gray-800 font-medium break-words">{user.email}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-semibold text-gray-500">ID de Usuario</p>
            <p className="text-gray-800 font-medium break-words">{user.uid}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full bg-red-600 text-white font-semibold py-3 mt-8 rounded-lg hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}