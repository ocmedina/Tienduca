"use client";

import { useState } from "react";

import Header from "../../components/Header";
import Hero from "../../components/Hero";
import Emprendedores from "../../components/Emprendedores";
import Categorias from "../../components/Categorias";
import Sumate from "../../components/Sumate";
import Sobre from "../../components/Sobre";
import Footer from "../../components/Footer";

export default function Home() {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string | null>(null);

  return (
    <>
      <Header />
      <Hero />
      <Categorias onCategoriaClick={(id) => setCategoriaSeleccionada(id)} />
      <Emprendedores  />
      <Sumate />
      <Sobre />
      <Footer />
    </>
  );
}
