"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // estado para carga
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      router.push("/perfil");
    } catch (err: any) {
      setError("Error al registrarse. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-8 mt-10">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">Crear Cuenta</h2>

      {error && (
        <p className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center font-medium">{error}</p>
      )}

      <label className="block mb-4">
        <span className="text-gray-700 font-medium mb-1 block">Nombre completo</span>
        <input
          type="text"
          placeholder="Tu nombre completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          required
          disabled={loading}
        />
      </label>

      <label className="block mb-4">
        <span className="text-gray-700 font-medium mb-1 block">Correo electrónico</span>
        <input
          type="email"
          placeholder="ejemplo@correo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          required
          disabled={loading}
        />
      </label>

      <label className="block mb-6">
        <span className="text-gray-700 font-medium mb-1 block">Contraseña</span>
        <input
          type="password"
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          required
          disabled={loading}
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-green-600 text-white font-semibold py-3 rounded-md transition-colors duration-300 ${
          loading ? "opacity-70 cursor-not-allowed" : "hover:bg-green-700"
        }`}
      >
        {loading ? "Registrando..." : "Registrarse"}
      </button>
    </form>
  );
}
