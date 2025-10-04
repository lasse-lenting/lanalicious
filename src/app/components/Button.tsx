// src/app/components/Button.tsx
import React from "react";

export default function Button({
    children,
    className
}: {
    children: React.ReactNode;
    className?: string;
}) {
  return (
    <button className={`bg-secondary text-white px-7 py-3 rounded-xl font-semibold hover:bg-secondary/80 transition-colors text-m ${className || ''}`}>
      {children}
    </button>
  );
}
