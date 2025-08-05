"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="pt-26 pb-20 bg-gradient-to-r from-blue-500 to-blue-700 text-white">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center">
        {/* Texto */}
        <motion.div
          className="md:w-1/2 text-center md:text-left"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-6">
            Conectá con{" "}
            <motion.span
              className="text-yellow-300"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
            >
              emprendedores locales
            </motion.span>{" "}
            y
            <br />
            hacé crecer tu comunidad.
          </h1>
          <p className="text-lg sm:text-xl mb-8 max-w-lg mx-auto md:mx-0">
            Descubrí productos, servicios y talento cerca de vos. Apoyá a quienes hacen grande tu barrio.
          </p>
          <motion.a
            href="#sumate"
            className="inline-block bg-yellow-400 text-blue-900 font-semibold px-8 py-4 rounded-lg shadow-lg hover:bg-yellow-300 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Sumate a Tienduca
          </motion.a>
        </motion.div>

        {/* Imagen o ilustración */}
        <motion.div
          className="md:w-1/2 mt-12 md:mt-0 flex justify-center"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        >
          <img
            src="/hero-emprendedores.png"
            alt="Emprendedores locales"
            className="w-full max-w-md rounded-lg shadow-lg"
            loading="lazy"
          />
        </motion.div>
      </div>
    </section>
  );
}
