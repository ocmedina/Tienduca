"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FirebaseError } from "firebase/app";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });

      setSuccess("Cuenta creada con éxito, redirigiendo...");
      setTimeout(() => router.push("/perfil"), 2000);
    } catch (err: unknown) {
      const error = err as FirebaseError;
      switch (error.code) {
        case "auth/email-already-in-use":
          setError("Este correo ya está en uso. Prueba con otro.");
          break;
        case "auth/invalid-email":
          setError("El formato del correo no es válido.");
          break;
        case "auth/weak-password":
          setError("La contraseña debe tener al menos 6 caracteres.");
          break;
        default:
          setError("Error al registrarse. Intenta nuevamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-8 mt-10">
      <div className="text-center mb-6">
        <Image
          src="/12.png"
          alt="Logo de Tienduca"
          width={100}
          height={100}
          priority
          className="mx-auto drop-shadow-lg"
        />
        <p className="text-gray-600 mt-4 leading-relaxed">
          Bienvenido, completa el formulario para crear tu cuenta y acceder a todas las funcionalidades de la plataforma.
          <br />
          ¡Es rápido y fácil!
        </p>
      </div>

      <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">Crear Cuenta</h2>

      {error && <p className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center font-medium">{error}</p>}
      {success && <p className="bg-green-100 text-green-700 p-3 rounded mb-4 text-center font-medium">{success}</p>}

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

      <label className="block mb-4">
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

      <label className="block mb-6">
        <span className="text-gray-700 font-medium mb-1 block">Confirmar contraseña</span>
        <input
          type="password"
          placeholder="********"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          required
          disabled={loading}
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-blue-600 text-white font-semibold py-3 rounded-md transition-colors duration-300 ${
          loading ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin h-5 w-5 mr-2 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            Registrando...
          </span>
        ) : (
          "Registrarse"
        )}
      </button>
    </form>
  );
}
