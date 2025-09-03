// src/app/layout.tsx
"use client";

import React from "react";
import "./global.css";
import { useInactivityLogout } from "@/hooks/useInactivityLogout";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Cierra sesión después de 15 minutos de inactividad
  useInactivityLogout(15);

  return (
    <html lang="es">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Tienduca - Tu tienda de emprendedores" />
        <link rel="icon" href="/12.png" />
        <title>Tienduca - Tu tienda de emprendedores</title>
      </head>
      <body>{children}</body>
    </html>
  );
}
