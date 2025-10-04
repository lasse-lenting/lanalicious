"use client";

import { useState } from "react";
import Image from "next/image";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 mt-14 mx-8">
      <div className="container mx-auto px-6 py-4 bg-white/10 backdrop-blur-md rounded-2xl">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Image src="/logo.webp" alt="Lanalicious" width={50} height={50} />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("product")}
              className="text-lg font-medium text-white hover:text-secondary transition-colors"
            >
              Product
            </button>
            <button
              onClick={() => scrollToSection("instructions")}
              className="text-lg font-medium text-white hover:text-secondary transition-colors"
            >
              Gebruiksaanwijzing
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="bg-secondary text-white px-6 py-2 rounded-lg font-bold hover:bg-secondary/90 transition-colors"
            >
              Contact
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-white"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 flex flex-col gap-4">
            <button
              onClick={() => scrollToSection("product")}
              className="text-lg font-medium text-white hover:text-secondary transition-colors text-left"
            >
              Product
            </button>
            <button
              onClick={() => scrollToSection("instructions")}
              className="text-lg font-medium text-white hover:text-secondary transition-colors text-left"
            >
              Gebruiksaanwijzing
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="bg-secondary text-white px-6 py-2 rounded-lg font-bold hover:bg-secondary/90 transition-colors text-left"
            >
              Contact
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}

