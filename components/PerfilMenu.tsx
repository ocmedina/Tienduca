"use client";

import { useState, useRef, useEffect } from "react";

export default function PerfilMenu() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div ref={menuRef} style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          backgroundColor: "green",
          color: "white",
          fontWeight: "bold",
          fontSize: "20px",
          border: "none",
          cursor: "pointer",
        }}
        aria-label="Abrir menú de perfil"
      >
        U
      </button>

      {menuOpen && (
        <div
          style={{
            position: "absolute",
            right: 0,
            marginTop: 8,
            width: 150,
            backgroundColor: "white",
            border: "1px solid gray",
            borderRadius: 8,
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            zIndex: 100,
          }}
        >
          <button
            onClick={() => alert("Cerrar sesión")}
            style={{
              width: "100%",
              padding: 8,
              backgroundColor: "white",
              border: "none",
              textAlign: "left",
              cursor: "pointer",
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "red")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "white")}
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
