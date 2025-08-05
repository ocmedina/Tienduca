// src/components/Sumate.tsx
"use client";
import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";

const Sumate = () => {
  return (
    <section className="bg-gray-100 py-16 px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto"
      >
        <h2 className="text-3xl font-bold mb-4">¿Sos emprendedor?</h2>
        <p className="text-gray-700 mb-6">
          Sumate gratis y hacé que tu emprendimiento llegue a más personas. Completá el formulario o escribinos directamente.
        </p>
        <a
          href="https://wa.me/5492611234567"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg text-lg hover:bg-green-600 transition"
        >
          <FaWhatsapp />
          Contactar por WhatsApp
        </a>
      </motion.div>
    </section>
  );
};

export default Sumate;
