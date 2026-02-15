"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./button";

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isAdminRoute = pathname.startsWith("/admin");
  if (isAdminRoute) return null;

  const navLinks = [
    { href: "/", label: "Inicio" },
    { href: "#servicios", label: "Servicios" },
    { href: "#cómo-funciona", label: "Cómo Funciona" },
    { href: "#testimonios", label: "Testimonios" },
  ];

  return (
    <nav className="navbar-enterprise navbar navbar-expand-lg navbar-light sticky-top">
      <div className="container-fluid px-4 px-md-5">
        <Link href="/" className="navbar-brand font-display fw-bold fs-4">
          <div className="d-flex align-items-center gap-2">
            <div className="gradient-primary p-2 rounded-2" style={{ width: "40px", height: "40px" }}>
              <span className="text-white fw-bold">✨</span>
            </div>
            <span className="text-gradient">LUMA</span>
          </div>
        </Link>

        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}>
          <ul className="navbar-nav ms-auto align-items-center gap-1 gap-lg-3">
            {navLinks.map((link) => (
              <li className="nav-item" key={link.href}>
                <Link
                  href={link.href}
                  className="nav-link-enterprise nav-link"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="nav-item">
              <Link 
                href="/admin/login"
                className="btn btn-primary-enterprise text-white px-3 py-2 ms-lg-3"
                onClick={() => setIsOpen(false)}
              >
                Acceder
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
