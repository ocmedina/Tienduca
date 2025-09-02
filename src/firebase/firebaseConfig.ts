// src/firebase/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // <--- agregar

// Configuración de Firebase (usa tus claves reales)
const firebaseConfig = {
  apiKey: "AIzaSyC1Cl6gMPMsAqRV6NVUHRP1A-oGLDQbnsI",
  authDomain: "tienduca-d29dc.firebaseapp.com",
  projectId: "tienduca-d29dc",
  storageBucket: "tienduca-d29dc.appspot.com", // <--- ojo que termina .appspot.com
  messagingSenderId: "629561886668",
  appId: "1:629561886668:web:90aacd95e13e0a567a3f69"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar servicios
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // <--- exportar storage

