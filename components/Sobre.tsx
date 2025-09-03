"use client";
import { motion } from "framer-motion";

const Sobre = () => {
  return (
    <section className="bg-white py-20 px-6">
      <motion.div
        className="max-w-3xl mx-auto text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-semibold mb-6 text-gray-900">
          Sobre nosotros
        </h2>
        <p className="text-gray-700 text-lg leading-relaxed mb-4">
          Somos un equipo de Rivadavia comprometido con el crecimiento local. Este proyecto nace con el objetivo de dar visibilidad a emprendedores, artesanos y pequeños negocios de nuestra comunidad.
        </p>
        <p className="text-gray-700 text-lg leading-relaxed mb-4">
          Tienduca es un espacio libre y colaborativo. Creemos que las ideas locales merecen ser descubiertas y apoyadas por todos los vecinos.
        </p>
        <p className="text-gray-700 italic text-lg leading-relaxed">
          Hecho con <span className="text-yellow-500">💛</span> por personas reales, para personas reales.
        </p>
      </motion.div>
    </section>
  );
};

export default Sobre;
