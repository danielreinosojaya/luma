"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/ui/navbar";
import { Sparkles, Star, ArrowRight, Users, Check, Calendar, Zap } from "lucide-react";

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-vh-100">
      <Navbar />

      {/* Hero Section */}
      <section className="hero-section py-5 py-lg-8" style={{ background: "linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 50%, #F3E8FF 100%)" }}>
        <div className="container container-enterprise py-5">
          <div className="row align-items-center min-vh-100">
            <div className="col-lg-6 mb-5 mb-lg-0 animate-fade-in">
              <Badge variant="default" className="mb-3">
                <Sparkles className="d-inline me-2" size={14} />
                Bienvenido a LUMA
              </Badge>

              <h1 className="display-3 fw-bold mb-4" style={{ lineHeight: "1.2" }}>
                <span className="text-gradient">Belleza Premium</span> en Tus Manos
              </h1>

              <p className="lead text-muted mb-5" style={{ fontSize: "1.25rem" }}>
                Descubre la experiencia de booking de belleza más elegante y moderna. Accede a servicios premium con profesionales certificados.
              </p>

              <div className="d-flex flex-column flex-sm-row gap-3 gap-lg-4">
                <Link href="/admin/login" className="btn btn-primary-enterprise text-white d-inline-flex align-items-center justify-content-center px-4 py-3">
                  Comenzar Ahora
                  <ArrowRight size={20} className="ms-2" />
                </Link>
                <a href="#servicios" className="btn btn-outline-enterprise d-inline-flex align-items-center justify-content-center px-4 py-3">
                  Ver Servicios
                </a>
              </div>

              <div className="d-flex gap-5 mt-8 mt-lg-10">
                <div>
                  <h3 className="h2 fw-bold text-primary">2.5K+</h3>
                  <p className="text-muted small">Clientes Satisfechos</p>
                </div>
                <div>
                  <h3 className="h2 fw-bold text-primary">98%</h3>
                  <p className="text-muted small">Tasa de Satisfacción</p>
                </div>
                <div>
                  <h3 className="h2 fw-bold text-primary">24/7</h3>
                  <p className="text-muted small">Disponible Siempre</p>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="position-relative">
                <div className="gradient-primary rounded-4 p-1" style={{ minHeight: "500px" }}>
                  <div className="bg-white rounded-4 h-100 d-flex align-items-center justify-content-center">
                    <div className="text-center">
                      <Sparkles size={80} className="text-primary mb-4 animate-float" />
                      <h3 className="fw-bold">Tu Belleza Merece lo Mejor</h3>
                      <p className="text-muted mt-3">Accede a profesionales certificados y servicios de calidad premium</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-8 py-lg-10 bg-white" id="servicios">
        <div className="container container-enterprise">
          <div className="text-center mb-8 mb-lg-10">
            <Badge variant="success" className="mb-3">
              <Zap className="d-inline me-2" size={14} />
              Nuestros Servicios
            </Badge>
            <h2 className="display-4 fw-bold mb-4">Experiencias de Belleza Únicas</h2>
            <p className="lead text-muted mx-auto" style={{ maxWidth: "500px" }}>
              Desde tratamientos faciales hasta servicios de uñas, ofrecemos una gama completa de servicios premium
            </p>
          </div>

          <div className="row g-4 g-lg-5">
            {[
              {
                icon: "💆‍♀️",
                title: "Tratamientos Faciales",
                description: "Revitaliza tu piel con nuestros tratamientos especializados usando productos premium",
              },
              {
                icon: "💅",
                title: "Servicios de Uñas",
                description: "Manicura y pedicura de lujo con los mejores productos internacionales",
              },
              {
                icon: "💇‍♀️",
                title: "Cuidado del Cabello",
                description: "Cortes, tintura y tratamientos capilares con expertos certificados",
              },
              {
                icon: "✨",
                title: "Tratamientos Especiales",
                description: "Lifting facial, microblading, pestañas y más servicios de belleza avanzada",
              },
            ].map((service, index) => (
              <div className="col-md-6 col-lg-3" key={index}>
                <Card className="h-100 card-enterprise card-hover">
                  <CardContent>
                    <div className="fs-1 mb-3">{service.icon}</div>
                    <h4 className="fw-bold mb-3">{service.title}</h4>
                    <p className="text-muted small mb-0">{service.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-8 py-lg-10" id="cómo-funciona" style={{ background: "linear-gradient(135deg, #F0F4FF 0%, #F0EFFF 100%)" }}>
        <div className="container container-enterprise">
          <div className="text-center mb-8 mb-lg-10">
            <Badge variant="info" className="mb-3">
              <Calendar className="d-inline me-2" size={14} />
              Proceso Simple
            </Badge>
            <h2 className="display-4 fw-bold mb-4">Cómo Funciona</h2>
            <p className="lead text-muted mx-auto" style={{ maxWidth: "500px" }}>
              Realiza tu cita en 3 simples pasos y disfruta de la mejor experiencia
            </p>
          </div>

          <div className="row g-4 align-items-center">
            {[
              { number: "1", title: "Elige Servicio", description: "Selecciona el servicio que deseas" },
              { number: "2", title: "Selecciona Fecha", description: "Elige la fecha y hora que te convenga" },
              { number: "3", title: "Confirma", description: "Completa tus datos y confirma la cita" },
            ].map((step, index) => (
              <div className="col-md-6 col-lg-4" key={index}>
                <Card className="card-enterprise card-hover h-100">
                  <CardContent>
                    <div 
                      className="gradient-primary d-inline-flex align-items-center justify-content-center rounded-circle mb-4 text-white fw-bold"
                      style={{ width: "60px", height: "60px", fontSize: "28px" }}
                    >
                      {step.number}
                    </div>
                    <h4 className="fw-bold mb-2">{step.title}</h4>
                    <p className="text-muted small">{step.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-8 py-lg-10 bg-white" id="testimonios">
        <div className="container container-enterprise">
          <div className="text-center mb-8 mb-lg-10">
            <Badge variant="warning" className="mb-3">
              <Star className="d-inline me-2" size={14} />
              Opiniones de Clientes
            </Badge>
            <h2 className="display-4 fw-bold mb-4">Lo Que Dicen Nuestros Clientes</h2>
          </div>

          <div className="row g-4">
            {[
              { rating: 5, name: "María García", text: "Excelente servicio, profesionales muy atentos. Volveré sin duda." },
              { rating: 5, name: "Jessica López", text: "La mejor experiencia de belleza que he tenido. Muy recomendado!" },
              { rating: 5, name: "Ana Martínez", text: "Impecable desde el principio hasta el final. Felicidades equipo." },
            ].map((testimonial, index) => (
              <div className="col-md-6 col-lg-4" key={index}>
                <Card className="card-enterprise h-100">
                  <CardContent>
                    <div className="d-flex gap-1 mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} size={16} className="text-warning" fill="currentColor" />
                      ))}
                    </div>
                    <p className="mb-4 text-muted">"{testimonial.text}"</p>
                    <div className="d-flex align-items-center gap-2">
                      <div className="gradient-primary rounded-circle p-2 text-white" style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {testimonial.name[0]}
                      </div>
                      <div>
                        <p className="fw-bold small mb-0">{testimonial.name}</p>
                        <p className="text-muted small mb-0">Cliente verificado</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8 py-lg-10" style={{ background: "linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)" }}>
        <div className="container container-enterprise">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <h2 className="display-4 fw-bold mb-4">¿Por Qué Elegir LUMA?</h2>
              <ul className="list-unstyled">
                {[
                  "Profesionales certificados y experimentados",
                  "Productos premium de marcas internacionales",
                  "Ambiente limpio y seguro",
                  "Horarios flexibles y disponibles",
                  "Atención personalizada",
                  "Garantía de satisfacción",
                ].map((feature, index) => (
                  <li className="mb-3 d-flex gap-3" key={index}>
                    <Check size={24} className="text-success flex-shrink-0 mt-1" />
                    <span className="text-muted">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-lg-6">
              <Card className="card-gradient card-enterprise">
                <CardContent>
                  <h3 className="fw-bold mb-4">¡Únete a Nuestros Clientes Satisfechos!</h3>
                  <p className="mb-4 opacity-75">Comienza tu viaje de belleza hoy mismo y vive la experiencia LUMA.</p>
                  <Link 
                    href="/admin/login"
                    className="btn btn-secondary-enterprise text-white w-100 d-inline-flex align-items-center justify-content-center px-4 py-3"
                  >
                    Agendar Mi Primera Cita
                    <ArrowRight size={20} className="ms-2" />
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-8">
        <div className="container container-enterprise">
          <div className="row g-4 mb-8">
            <div className="col-md-3">
              <h5 className="fw-bold mb-3">LUMA</h5>
              <p className="text-muted small">Premium beauty services for everyone.</p>
            </div>
            <div className="col-md-3">
              <h6 className="fw-bold mb-3">Producto</h6>
              <ul className="list-unstyled small text-muted">
                <li className="mb-2"><a href="#" className="text-reset text-decoration-none">Características</a></li>
                <li className="mb-2"><a href="#" className="text-reset text-decoration-none">Precios</a></li>
                <li><a href="#" className="text-reset text-decoration-none">Seguridad</a></li>
              </ul>
            </div>
            <div className="col-md-3">
              <h6 className="fw-bold mb-3">Compañía</h6>
              <ul className="list-unstyled small text-muted">
                <li className="mb-2"><a href="#" className="text-reset text-decoration-none">Sobre Nosotros</a></li>
                <li className="mb-2"><a href="#" className="text-reset text-decoration-none">Blog</a></li>
                <li><a href="#" className="text-reset text-decoration-none">Contacto</a></li>
              </ul>
            </div>
            <div className="col-md-3">
              <h6 className="fw-bold mb-3">Legal</h6>
              <ul className="list-unstyled small text-muted">
                <li className="mb-2"><a href="#" className="text-reset text-decoration-none">Privacidad</a></li>
                <li className="mb-2"><a href="#" className="text-reset text-decoration-none">Términos</a></li>
                <li><a href="#" className="text-reset text-decoration-none">Cookies</a></li>
              </ul>
            </div>
          </div>
          <hr className="border-secondary my-0 mb-4" />
          <div className="d-flex justify-content-between align-items-center small text-muted">
            <p>© 2026 LUMA Beauty Studio. Todos los derechos reservados.</p>
            <div className="d-flex gap-3">
              <a href="#" className="text-reset text-decoration-none">Twitter</a>
              <a href="#" className="text-reset text-decoration-none">Instagram</a>
              <a href="#" className="text-reset text-decoration-none">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
