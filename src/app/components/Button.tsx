// src/app/components/Button.tsx
import React from "react";

export default function Button(
    { children }: { children: React.ReactNode }
) {
  return (
    <button className="bg-[#FF69B4] text-white px-7 py-3 rounded-xl font-semibold hover:bg-[#FF69B4] transition-colors text-md">
      {children}
    </button>
  );
}
