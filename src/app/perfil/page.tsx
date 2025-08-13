"use client";

import { useEffect, useState } from "react";
import { getAuth, User, onAuthStateChanged, signOut } from "firebase/auth";

const auth = getAuth();
import { useRouter } from "next/navigation";

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

  if (!user) return null;

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl mb-4">Perfil</h1>
      <p><strong>Nombre:</strong> {user.displayName || "Sin nombre"}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 mt-4">
        Cerrar sesión
      </button>
    </div>
  );
}
