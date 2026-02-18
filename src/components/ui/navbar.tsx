"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isAdminRoute = pathname.startsWith("/admin");
  if (isAdminRoute) return null;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#servicios", label: "Servicios" },
    { href: "#como-funciona", label: "Cómo Funciona" },
    { href: "#testimonios", label: "Testimonios" },
    { href: "#contacto", label: "Contacto" },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.5, 0, 0.05, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
        isScrolled
          ? "bg-salon-cream/90 backdrop-blur-xl shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="flex items-center justify-between px-6 md:px-12 py-5">
        {/* Logo */}
        <Link 
          href="/" 
          className="font-display text-2xl tracking-extra-wide text-salon-dark font-medium hover:opacity-80 transition-opacity duration-300"
        >
          LUMA
        </Link>

        {/* Nav Desktop */}
        <nav className="hidden lg:flex items-center gap-10">
          {navLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm tracking-wider text-salon-subtle hover:text-salon-dark transition-colors duration-300 uppercase font-body"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* CTA Button */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="hidden md:block"
        >
          <Link
            href="/admin/login"
            className="flex items-center gap-2 px-6 py-2.5 bg-salon-dark text-white text-sm tracking-wider uppercase hover:bg-salon-accent transition-colors duration-300 font-body"
          >
            Acceder
            <ArrowUpRight size={14} />
          </Link>
        </motion.div>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden text-salon-dark hover:text-salon-accent transition-colors duration-300"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="lg:hidden bg-salon-cream border-t border-salon-accent/20"
        >
          <nav className="flex flex-col px-6 py-8 gap-6">
            {navLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm tracking-wider text-salon-subtle hover:text-salon-dark transition-colors duration-300 uppercase font-body"
              >
                {item.label}
              </a>
            ))}
            <Link
              href="/admin/login"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-salon-dark text-white text-sm tracking-wider uppercase hover:bg-salon-accent transition-colors duration-300 font-body mt-4"
            >
              Acceder
              <ArrowUpRight size={14} />
            </Link>
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
}
