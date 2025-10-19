// src/componets/ui/Card.jsx
import React from "react";

export default function Card({ title, children, className = "" }) {
  return (
    <section
      className={`rounded-2xl border border-white/10 
                  bg-white/5 backdrop-blur-md shadow-xl shadow-black/20 
                  p-5 md:p-6 ${className}`}
    >
      {title && <h2 className="text-xl md:text-2xl font-semibold mb-4">{title}</h2>}
      {children}
    </section>
  );
}
