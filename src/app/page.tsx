'use client';

import { useState } from 'react';
import { 
  Calendar, Clock, User, Phone, Scissors, Heart, Menu, X,
  Search, ArrowRight, Droplet, Sparkles, Plus, ChevronLeft, 
  ChevronRight, Star, Instagram, Facebook, Mail, MapPin
} from 'lucide-react';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white" suppressHydrationWarning>
      {/* Navegación */}
      <Navigation mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

      {/* Héroe */}
      <Hero />

      {/* Servicios */}
      <Services />

      {/* Estilistas */}
      <Stylists />

      {/* Testimonios */}
      <Testimonials />

      {/* Galería */}
      <Gallery />

      {/* Reserva */}
      <Booking />

      {/* Pie de página */}
      <Footer />
    </div>
  );
}

// ============================================================
// NAVEGACIÓN
// ============================================================
function Navigation({ mobileMenuOpen, setMobileMenuOpen }: any) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="border-2 border-black px-2.5 sm:px-3 py-1">
            <span className="font-serif text-lg sm:text-xl tracking-wider">LUMA</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm">
          <a href="#servicios" className="hover:opacity-60 transition-opacity">Servicios</a>
          <a href="#estilistas" className="hover:opacity-60 transition-opacity">Estilistas</a>
          <a href="#galeria" className="hover:opacity-60 transition-opacity">Galería</a>
          <a href="#reservar" className="hover:opacity-60 transition-opacity">Reservar</a>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <button className="hover:opacity-60 transition-opacity">
            <Search size={20} />
          </button>
          <button className="hover:opacity-60 transition-opacity">
            <User size={20} />
          </button>
          <button className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors text-sm font-medium">
            Reservar Ahora
          </button>
        </div>

        {/* Botón de Menú Móvil */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 -mr-2"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Menú Móvil */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-4 space-y-3">
            <a href="#servicios" className="block text-sm hover:opacity-60 py-2">Servicios</a>
            <a href="#estilistas" className="block text-sm hover:opacity-60 py-2">Estilistas</a>
            <a href="#galeria" className="block text-sm hover:opacity-60 py-2">Galería</a>
            <a href="#reservar" className="block text-sm hover:opacity-60 py-2">Reservar</a>
            <button className="w-full bg-black text-white px-6 py-2.5 rounded-full hover:bg-gray-800 transition-colors text-sm font-medium mt-2">
              Reservar Ahora
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

// ============================================================
// SECCIÓN HÉROE
// ============================================================
function Hero() {
  return (
    <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-xs text-gray-500 mb-8 sm:mb-12 flex items-center gap-2">
          <div className="h-px w-6 sm:w-8 bg-gray-400" />
          DESDE 2026
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Contenido de Texto */}
          <div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif leading-tight sm:leading-none mb-4 sm:mb-6">
              Redefine<br />
              <span className="italic text-rose-300">Tu</span> Belleza
            </h1>

            <p className="text-gray-600 text-base sm:text-lg mb-6 sm:mb-8 max-w-md leading-relaxed">
              Experimenta el arte del cuidado del cabello y uñas en un santuario diseñado para la elegancia moderna. Donde el estilo se encuentra con la sustancia.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-12">
              <button className="bg-black text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-gray-800 transition-all hover:scale-105 font-medium text-sm sm:text-base">
                Reservar Cita
              </button>
              <button className="border-2 border-black px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2 group font-medium text-sm sm:text-base">
                Ver Servicios
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform hidden sm:block" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-8">
              <div>
                <div className="text-3xl sm:text-4xl font-serif mb-1">5k+</div>
                <div className="text-xs sm:text-sm text-gray-500">Clientes Felices</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-serif mb-1">4.9</div>
                <div className="text-xs sm:text-sm text-gray-500">Calificación</div>
              </div>
              <div className="flex -space-x-2 sm:-space-x-3 col-span-2 sm:col-span-1">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-pink-300 to-rose-400 border-2 border-white flex-shrink-0" />
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-300 to-cyan-400 border-2 border-white flex-shrink-0" />
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-amber-300 to-orange-400 border-2 border-white flex-shrink-0" />
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium flex-shrink-0">
                  +2k
                </div>
              </div>
            </div>
          </div>

          {/* Imágenes - Reordenado en móvil */}
          <div className="relative order-first lg:order-last">
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Salon Interior"
                className="w-full h-auto object-cover aspect-[3/4]"
              />
            </div>

            {/* Tarjetas flotantes - Escondidas en xs, pequeñas en sm */}
            <div className="hidden sm:block absolute -bottom-4 -left-4 bg-white rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 flex items-center gap-3 max-w-xs">
              <div className="bg-gray-100 p-2 rounded-full flex-shrink-0">
                <Scissors size={16} className="text-gray-700 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs text-gray-500">Estilista Disponible</div>
                <div className="font-semibold text-sm">Reservar con Sarah</div>
              </div>
            </div>

            <div className="hidden sm:block absolute top-8 -right-4 bg-teal-50 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 max-w-xs">
              <div className="bg-white p-2 rounded-full w-fit mb-3 text-lg sm:text-2xl">
                💅
              </div>
              <div className="font-serif text-lg sm:text-xl mb-1">Arte de Uñas</div>
              <div className="text-xs sm:text-sm text-gray-600 mb-2">Manicura y Pedicura</div>
              <div className="h-1 bg-teal-400 rounded-full w-3/4" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// SECCIÓN SERVICIOS
// ============================================================
function Services() {
  const services = [
    {
      title: 'Color y Tratamiento',
      description: 'Balayage, Ombre, Keratina y más.',
      price: 'Desde $85',
      color: 'bg-teal-50',
      icon: Droplet,
    },
    {
      title: 'Arte de Uñas',
      description: 'Gel, Acrílico y Arte Personalizado.',
      price: 'Desde $45',
      color: 'bg-purple-50',
      icon: Sparkles,
    },
    {
      title: 'Peinado de Firma',
      description: 'Cortes, Secado y Peinado.',
      price: 'Desde $65',
      color: 'bg-rose-50',
      icon: ArrowRight,
    },
  ];

  const tickerItems = [
    'CORTE Y PEINADO',
    'TRATAMIENTO DE COLOR',
    'ARTE DE UÑAS',
    'PAQUETES NUPCIALES',
    'PEDICURA SPA',
    'EXTENSIONES DE CABELLO',
  ];

  return (
    <section id="servicios" className="py-12 sm:py-24 bg-white">
      <div className="overflow-hidden bg-black text-white py-3 sm:py-4 mb-12 sm:mb-16">
        <div className="flex w-max animate-marquee whitespace-nowrap will-change-transform [transform:translate3d(0,0,0)]">
          {[...tickerItems, ...tickerItems].map((item, index) => (
            <span key={`${item}-${index}`} className="mx-4 sm:mx-8 text-xs sm:text-sm tracking-widest">
              {item} •
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif mb-3 sm:mb-4">Servicios Seleccionados</h2>
          <p className="text-gray-600 text-sm sm:text-base max-w-md">
            Elige de nuestra amplia gama de tratamientos premium de cabello y uñas diseñados para que brilles.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg group cursor-pointer h-80 sm:h-96">
            <img
              src="https://images.pexels.com/photos/3065171/pexels-photo-3065171.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Signature Hair Styling"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
              <h3 className="text-xl sm:text-2xl font-serif mb-1 sm:mb-2">Peinado de Firma</h3>
              <p className="text-xs sm:text-sm text-gray-300 mb-3">Cortes, Secado y Peinado</p>
              <button className="bg-white text-black p-2 rounded-full hover:scale-110 transition-transform">
                <ArrowRight size={16} className="sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {services.map((service, index) => (
            <div
              key={index}
              className={`${service.color} rounded-2xl sm:rounded-3xl p-5 sm:p-8 hover:scale-105 transition-transform cursor-pointer`}
            >
              <div className="bg-white p-2.5 sm:p-3 rounded-full w-fit mb-4 sm:mb-6">
                <service.icon size={20} className="text-gray-800 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-lg sm:text-2xl font-serif mb-2 sm:mb-3">{service.title}</h3>
              <p className="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6">{service.description}</p>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm sm:text-base">{service.price}</span>
                <button className="bg-white p-2 rounded-full hover:scale-110 transition-transform">
                  <Plus size={16} className="sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl sm:rounded-3xl p-6 sm:p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 sm:w-64 h-32 sm:h-64 bg-rose-500/20 rounded-full blur-3xl" />
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 items-center">
            <div>
              <div className="bg-white text-black text-xs px-3 py-1 rounded-full w-fit mb-3 sm:mb-4 font-medium">
                CLIENTE NUEVO
              </div>
              <h3 className="text-2xl sm:text-4xl font-serif mb-3 sm:mb-4">Obtén 20% de Descuento en Tu Primera Visita</h3>
              <p className="text-gray-300 text-sm sm:text-base mb-4 sm:mb-6">
                Experimenta lujo por menos. Reserva cualquier servicio de cabello o uñas hoy.
              </p>
              <button className="bg-white text-black px-6 sm:px-8 py-2.5 sm:py-3 rounded-full hover:bg-gray-100 transition-colors font-medium text-sm sm:text-base">
                Reclamar Oferta
              </button>
            </div>
            <div className="relative h-64 sm:h-80">
              <img
                src="https://images.pexels.com/photos/3997379/pexels-photo-3997379.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Nail Art"
                className="rounded-lg sm:rounded-2xl shadow-2xl w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        .animate-marquee {
          animation: marquee 34s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}

// ============================================================
// SECCIÓN ESTILISTAS
// ============================================================
function Stylists() {
  const stylists = [
    {
      name: 'Elena Rodriguez',
      role: 'Estilista Maestra',
      specialty: 'Especializada en balayage y cortes de precisión.',
      image: 'https://images.pexels.com/photos/3065171/pexels-photo-3065171.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 5,
    },
    {
      name: 'Marcus Chen',
      role: 'Técnico de Uñas',
      specialty: 'Experto en arte de uñas complicado y extensiones de gel.',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 5,
    },
    {
      name: 'Sarah James',
      role: 'Colorista',
      specialty: 'Especialista en colores vividos y corrección de color.',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 5,
    },
    {
      name: 'Amara Okafor',
      role: 'Especialista Nupcial',
      specialty: 'Experta en cabello y maquillaje nupcial.',
      image: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 5,
    },
  ];

  return (
    <section id="estilistas" className="py-12 sm:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif mb-2 sm:mb-4">Nuestros Artistas</h2>
          <p className="text-gray-600 text-sm sm:text-base">Conoce a los expertos detrás de la magia.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {stylists.map((stylist, index) => (
            <div
              key={index}
              className="group cursor-pointer"
            >
              <div className="relative rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden mb-2 sm:mb-3 lg:mb-4 bg-gray-100 h-80 sm:h-96 lg:aspect-[3/4]">
                <img
                  src={stylist.image}
                  alt={stylist.name}
                  className="w-full h-full object-cover object-center md:grayscale md:group-hover:grayscale-0 md:group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute top-1.5 sm:top-3 left-1.5 sm:left-3 bg-white text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full font-medium truncate">
                  {stylist.role.toUpperCase()}
                </div>
              </div>

              <div className="flex items-start justify-between gap-1 sm:gap-2 mb-1 sm:mb-2">
                <h3 className="text-sm sm:text-lg lg:text-xl font-serif flex-1 line-clamp-2">{stylist.name}</h3>
                <div className="flex gap-0.5 flex-shrink-0 mt-0.5">
                  {[...Array(stylist.rating)].map((_, i) => (
                    <Star key={i} size={10} className="sm:w-3 sm:h-3 lg:w-3.5 lg:h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>

              <p className="text-xs sm:text-xs lg:text-sm text-gray-600 mb-2 sm:mb-3 lg:mb-4 line-clamp-2">{stylist.specialty}</p>

              <button className="text-xs sm:text-xs lg:text-sm border-2 border-black px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 rounded-full hover:bg-black hover:text-white transition-colors w-full font-medium">
                Reservar
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// SECCIÓN TESTIMONIOS
// ============================================================
function Testimonials() {
  const testimonials = [
    {
      text: "Absolutamente la mejor experiencia de salón que he tenido. La atmósfera es impresionante y mi cabello nunca se ha visto mejor.",
      author: 'Jessica M.',
      role: 'Cliente Regular',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
    {
      text: "El arte de uñas aquí es de otro nivel. Marcus es un verdadero artista. ¡Recibo cumplidos dondequiera que voy!",
      author: 'Ashley T.',
      role: 'Amante de Uñas',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
    {
      text: "Desde el momento en que entras, te sientes consentida. El equipo es profesional y los resultados son siempre impecables.",
      author: 'David K.',
      role: 'Cliente Nuevo',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
  ];

  return (
    <section className="py-8 sm:py-20 lg:py-24 bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-6 sm:mb-10 lg:mb-12">
          <h2 className="text-2xl sm:text-4xl lg:text-6xl font-serif mb-2 sm:mb-3 lg:mb-4 leading-tight">Amor de Los Clientes</h2>
          <p className="text-gray-400 max-w-2xl text-xs sm:text-sm lg:text-base">
            No solo tomes nuestra palabra. Aquí está lo que nuestra comunidad tiene que decir sobre su experiencia.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-10 lg:mb-12">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-800/50 backdrop-blur rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 hover:bg-gray-800/70 transition-colors"
            >
              <div className="flex gap-1 mb-3 sm:mb-4 lg:mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} className="sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="text-gray-300 mb-4 sm:mb-6 lg:mb-8 leading-relaxed text-xs sm:text-sm lg:text-base line-clamp-4">
                "{testimonial.text}"
              </p>

              <div className="flex items-center gap-2 sm:gap-3">
                <img
                  src={testimonial.image}
                  alt={testimonial.author}
                  className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full object-cover flex-shrink-0"
                />
                <div className="min-w-0">
                  <div className="font-semibold text-xs sm:text-sm lg:text-base">{testimonial.author}</div>
                  <div className="text-xs text-gray-400">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden sm:flex justify-center gap-2 sm:gap-3">
          <button className="p-2 sm:p-3 border-2 border-white rounded-full hover:bg-white hover:text-black transition-colors">
            <ChevronLeft size={16} className="sm:w-5 sm:h-5" />
          </button>
          <button className="p-2 sm:p-3 border-2 border-white rounded-full hover:bg-white hover:text-black transition-colors">
            <ChevronRight size={16} className="sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// SECCIÓN GALERÍA
// ============================================================
function Gallery() {
  const galleryImages = [
    'https://images.pexels.com/photos/3065171/pexels-photo-3065171.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/3997379/pexels-photo-3997379.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/3992870/pexels-photo-3992870.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/3764548/pexels-photo-3764548.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/3065209/pexels-photo-3065209.jpeg?auto=compress&cs=tinysrgb&w=400',
  ];

  return (
    <section id="galeria" className="py-12 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif mb-3 sm:mb-4">Galería Instagram</h2>
          <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6">
            Síguenos para inspiración diaria y contenido exclusivo detrás de cámaras
          </p>
          <a
            href="https://instagram.com/luma.ec"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs sm:text-sm hover:opacity-60 transition-opacity font-medium"
          >
            <Instagram size={16} className="sm:w-5 sm:h-5" />
            @luma.ec
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-lg sm:rounded-2xl overflow-hidden group cursor-pointer"
            >
              <img
                src={image}
                alt={`Gallery ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Instagram size={24} className="text-white sm:w-8 sm:h-8" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// SECCIÓN DE RESERVA
// ============================================================
function Booking() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: '',
    date: '',
    time: '',
  });

  return (
    <section id="reservar" className="py-24 bg-gradient-to-br from-rose-50 via-white to-teal-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-5xl md:text-6xl font-serif mb-6">
              ¿Listo para tu transformación?
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Reserva tu cita en línea en segundos. Elige tu servicio, estilista y hora preferida.
            </p>

            <div className="bg-white rounded-3xl shadow-xl p-8">
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tu Nombre"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none transition-colors"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="relative">
                  <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    placeholder="Número de Teléfono"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none transition-colors"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="relative mb-4">
                <Scissors size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <select 
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none transition-colors appearance-none bg-white"
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                >
                  <option>Seleccionar Servicio</option>
                  <option>Corte y Peinado</option>
                  <option>Tratamiento de Color</option>
                  <option>Arte de Uñas</option>
                  <option>Paquete Nupcial</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 text-xs font-semibold">
                  ✓
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="relative">
                  <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none transition-colors"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div className="relative">
                  <Clock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select 
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none transition-colors appearance-none bg-white"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  >
                    <option>Hora</option>
                    <option>9:00 AM</option>
                    <option>10:00 AM</option>
                    <option>11:00 AM</option>
                    <option>2:00 PM</option>
                    <option>3:00 PM</option>
                    <option>4:00 PM</option>
                  </select>
                </div>
              </div>

              <button className="w-full bg-black text-white py-4 rounded-xl hover:bg-gray-800 transition-colors text-lg font-medium">
                Verificar Disponibilidad
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white rounded-3xl shadow-xl p-6 max-w-md mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center text-xl font-serif">
                  L
                </div>
                <div>
                  <div className="font-semibold">Luma</div>
                  <div className="text-sm text-green-500 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                    Abierto Ahora
                  </div>
                </div>
                <button className="ml-auto">
                  <Heart size={20} className="text-rose-500 fill-rose-500" />
                </button>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 mb-4">
                <p className="text-sm mb-3">
                  ¡Hola! 👋 ¿Cómo podemos ayudarte a verte lo mejor posible hoy?
                </p>
              </div>

              <div className="bg-black text-white rounded-2xl rounded-br-sm p-4 mb-4 ml-auto max-w-[85%]">
                <p className="text-sm">
                  Me gustaría reservar un corte de cabello para mañana.
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 mb-4">
                <p className="text-sm mb-3">
                  ¡Excelente! Tenemos una disponibilidad a las 2:00 PM con Elena. ¿Te funciona?
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src="https://images.pexels.com/photos/3065171/pexels-photo-3065171.jpeg?auto=compress&cs=tinysrgb&w=100"
                    alt="Service"
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <div className="text-sm font-semibold">Corte de Firma</div>
                    <div className="text-xs text-gray-500">con Elena</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <input
                  type="text"
                  placeholder="Escribe un mensaje..."
                  className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-full focus:border-black focus:outline-none text-sm"
                />
                <button className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors text-sm font-medium">
                  Enviar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// SECCIÓN PIE DE PÁGINA
// ============================================================
function Footer() {
  return (
    <footer className="bg-black text-white py-8 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12 mb-8 sm:mb-12">
          <div>
            <div className="border-2 border-white px-2 sm:px-3 py-1 w-fit mb-4 sm:mb-6">
              <span className="font-serif text-lg sm:text-xl tracking-wider">LUMA</span>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
              Donde el estilo se encuentra con la sustancia. Experimenta el arte del cuidado del cabello y uñas en elegancia moderna.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3 sm:mb-4 text-white text-sm sm:text-base">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
              <li><a href="#servicios" className="hover:text-white transition-colors">Servicios</a></li>
              <li><a href="#estilistas" className="hover:text-white transition-colors">Nuestro Equipo</a></li>
              <li><a href="#galeria" className="hover:text-white transition-colors">Galería</a></li>
              <li><a href="#reservar" className="hover:text-white transition-colors">Reservas</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3 sm:mb-4 text-white text-sm sm:text-base">Contacto</h3>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <Phone size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                <span>(593) 2 123-4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                <span>hola@luma.ec</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={14} className="mt-0.5 flex-shrink-0 sm:w-4 sm:h-4" />
                <span>Calle Belleza 123<br />Quito, Pichincha</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3 sm:mb-4 text-white text-sm sm:text-base">Horarios</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
              <li className="flex justify-between gap-4">
                <span>Lun - Vie</span>
                <span className="text-right">9AM - 8PM</span>
              </li>
              <li className="flex justify-between gap-4">
                <span>Sábado</span>
                <span className="text-right">10AM - 6PM</span>
              </li>
              <li className="flex justify-between gap-4">
                <span>Domingo</span>
                <span className="text-right">Cerrado</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 sm:pt-8 flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:justify-between sm:items-center gap-4">
          <p className="text-xs sm:text-sm text-gray-400 text-center sm:text-left">
            © 2026 Luma. Todos los derechos reservados.
          </p>
          <div className="flex gap-3 sm:gap-4 justify-center">
            <a href="#" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-gray-700 flex items-center justify-center hover:bg-white hover:text-black transition-colors flex-shrink-0">
              <Instagram size={16} className="sm:w-4.5 sm:h-4.5" />
            </a>
            <a href="#" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-gray-700 flex items-center justify-center hover:bg-white hover:text-black transition-colors flex-shrink-0">
              <Facebook size={16} className="sm:w-4.5 sm:h-4.5" />
            </a>
            <a href="#" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-gray-700 flex items-center justify-center hover:bg-white hover:text-black transition-colors flex-shrink-0">
              <Mail size={16} className="sm:w-4.5 sm:h-4.5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
