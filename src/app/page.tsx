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
    <div className="min-h-screen bg-white">
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
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="border-2 border-black px-3 py-1">
            <span className="font-serif text-xl tracking-wider">LUMA</span>
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
          className="md:hidden p-2"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Menú Móvil */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-6 py-4 space-y-4">
            <a href="#servicios" className="block text-sm hover:opacity-60">Servicios</a>
            <a href="#estilistas" className="block text-sm hover:opacity-60">Estilistas</a>
            <a href="#galeria" className="block text-sm hover:opacity-60">Galería</a>
            <a href="#reservar" className="block text-sm hover:opacity-60">Reservar</a>
            <button className="w-full bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors text-sm">
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
    <section className="pt-32 pb-20 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-xs text-gray-500 mb-12 flex items-center gap-2">
          <div className="h-px w-8 bg-gray-400" />
          DESDE 2024
        </div>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-7xl md:text-8xl font-serif leading-none mb-6">
              Redefine<br />
              <span className="italic text-rose-300">Tu</span> Belleza
            </h1>

            <p className="text-gray-600 text-lg mb-8 max-w-md leading-relaxed">
              Experimenta el arte del cuidado del cabello y uñas en un santuario diseñado para la elegancia moderna. Donde el estilo se encuentra con la sustancia.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <button className="bg-black text-white px-8 py-4 rounded-full hover:bg-gray-800 transition-all hover:scale-105 font-medium">
                Reservar Cita
              </button>
              <button className="border-2 border-black px-8 py-4 rounded-full hover:bg-black hover:text-white transition-all flex items-center gap-2 group font-medium">
                Ver Servicios
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="flex items-center gap-12">
              <div>
                <div className="text-4xl font-serif mb-1">5k+</div>
                <div className="text-sm text-gray-500">Clientes Felices</div>
              </div>
              <div>
                <div className="text-4xl font-serif mb-1">4.9</div>
                <div className="text-sm text-gray-500">Calificación</div>
              </div>
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-300 to-rose-400 border-2 border-white" />
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-300 to-cyan-400 border-2 border-white" />
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-300 to-orange-400 border-2 border-white" />
                <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium">
                  +2k
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Salon Interior"
                className="w-full h-[600px] object-cover"
              />
            </div>

            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-lg p-4 flex items-center gap-3">
              <div className="bg-gray-100 p-2 rounded-full">
                <Scissors size={20} className="text-gray-700" />
              </div>
              <div>
                <div className="text-xs text-gray-500">Estilista Disponible</div>
                <div className="font-semibold">Reservar con Sarah</div>
              </div>
            </div>

            <div className="absolute top-12 -right-6 bg-teal-50 rounded-2xl shadow-lg p-6 max-w-[200px]">
              <div className="bg-white p-2 rounded-full w-fit mb-3">
                <div className="text-2xl">💅</div>
              </div>
              <div className="font-serif text-xl mb-1">Arte de Uñas</div>
              <div className="text-sm text-gray-600 mb-2">Manicura y Pedicura</div>
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
    'CORTE Y PEINADO',
    'TRATAMIENTO DE COLOR',
    'ARTE DE UÑAS',
  ];

  return (
    <section id="servicios" className="py-24 bg-white">
      <div className="overflow-hidden bg-black text-white py-4 mb-16">
        <div className="flex animate-scroll whitespace-nowrap">
          {tickerItems.map((item, index) => (
            <span key={index} className="mx-8 text-sm tracking-widest">
              {item} •
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-5xl md:text-6xl font-serif mb-4">Servicios Seleccionados</h2>
            <p className="text-gray-600 max-w-md">
              Elige de nuestra amplia gama de tratamientos premium de cabello y uñas diseñados para que brilles.
            </p>
          </div>
          <button className="hidden md:flex items-center gap-2 text-sm hover:gap-4 transition-all font-medium">
            Ver Menú Completo
            <ArrowRight size={18} />
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="relative rounded-3xl overflow-hidden shadow-lg group cursor-pointer">
            <img
              src="https://images.pexels.com/photos/3065171/pexels-photo-3065171.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Signature Hair Styling"
              className="w-full h-[400px] object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="text-2xl font-serif mb-2">Peinado de Firma</h3>
              <p className="text-sm text-gray-300 mb-3">Cortes, Secado y Peinado</p>
              <button className="bg-white text-black p-2 rounded-full hover:scale-110 transition-transform">
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

          {services.map((service, index) => (
            <div
              key={index}
              className={`${service.color} rounded-3xl p-8 hover:scale-105 transition-transform cursor-pointer`}
            >
              <div className="bg-white p-3 rounded-full w-fit mb-6">
                <service.icon size={24} className="text-gray-800" />
              </div>
              <h3 className="text-2xl font-serif mb-3">{service.title}</h3>
              <p className="text-gray-600 text-sm mb-6">{service.description}</p>
              <div className="flex items-center justify-between">
                <span className="font-semibold">{service.price}</span>
                <button className="bg-white p-2 rounded-full hover:scale-110 transition-transform">
                  <Plus size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/20 rounded-full blur-3xl" />
          <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="bg-white text-black text-xs px-3 py-1 rounded-full w-fit mb-4 font-medium">
                CLIENTE NUEVO
              </div>
              <h3 className="text-4xl font-serif mb-4">Obtén 20% de Descuento en Tu Primera Visita</h3>
              <p className="text-gray-300 mb-6">
                Experimenta lujo por menos. Reserva cualquier servicio de cabello o uñas hoy.
              </p>
              <button className="bg-white text-black px-8 py-3 rounded-full hover:bg-gray-100 transition-colors font-medium">
                Reclamar Oferta
              </button>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/3997379/pexels-photo-3997379.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Nail Art"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
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
    <section id="estilistas" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-5xl md:text-6xl font-serif mb-4">Nuestros Artistas</h2>
            <p className="text-gray-600">Conoce a los expertos detrás de la magia.</p>
          </div>
          <div className="hidden md:flex gap-3">
            <button className="p-3 border-2 border-black rounded-full hover:bg-black hover:text-white transition-colors">
              <ChevronLeft size={20} />
            </button>
            <button className="p-3 border-2 border-black rounded-full hover:bg-black hover:text-white transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stylists.map((stylist, index) => (
            <div
              key={index}
              className="group cursor-pointer"
            >
              <div className="relative rounded-3xl overflow-hidden mb-4 aspect-[3/4]">
                <img
                  src={stylist.image}
                  alt={stylist.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500"
                />
                <div className="absolute top-4 left-4 bg-white text-xs px-3 py-1 rounded-full font-medium">
                  {stylist.role.toUpperCase()}
                </div>
              </div>

              <div className="flex items-start justify-between mb-2">
                <h3 className="text-xl font-serif">{stylist.name}</h3>
                <div className="flex gap-0.5">
                  {[...Array(stylist.rating)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" className="text-amber-400" />
                  ))}
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4">{stylist.specialty}</p>

              <button className="text-sm border-2 border-black px-6 py-2 rounded-full hover:bg-black hover:text-white transition-colors w-full font-medium">
                Reservar con {stylist.name.split(' ')[0]}
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
    <section className="py-24 bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <h2 className="text-5xl md:text-6xl font-serif mb-4">Amor de Los Clientes</h2>
          <p className="text-gray-400 max-w-2xl">
            No solo tomes nuestra palabra. Aquí está lo que nuestra comunidad tiene que decir sobre su experiencia.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-800/50 backdrop-blur rounded-3xl p-8 hover:bg-gray-800/70 transition-colors"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" className="text-amber-400" />
                ))}
              </div>

              <p className="text-gray-300 mb-8 leading-relaxed">
                "{testimonial.text}"
              </p>

              <div className="flex items-center gap-3">
                <img
                  src={testimonial.image}
                  alt={testimonial.author}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold">{testimonial.author}</div>
                  <div className="text-sm text-gray-400">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-3">
          <button className="p-3 border-2 border-white rounded-full hover:bg-white hover:text-black transition-colors">
            <ChevronLeft size={20} />
          </button>
          <button className="p-3 border-2 border-white rounded-full hover:bg-white hover:text-black transition-colors">
            <ChevronRight size={20} />
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
    <section id="galeria" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl font-serif mb-4">Galería Instagram</h2>
          <p className="text-gray-600 mb-6">
            Síguenos para inspiración diaria y contenido exclusivo detrás de cámaras
          </p>
          <a
            href="https://instagram.com/luma.ec"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm hover:opacity-60 transition-opacity font-medium"
          >
            <Instagram size={20} />
            @luma.ec
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer"
            >
              <img
                src={image}
                alt={`Gallery ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Instagram size={32} className="text-white" />
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
    <footer className="bg-black text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="border-2 border-white px-3 py-1 w-fit mb-6">
              <span className="font-serif text-xl tracking-wider">LUMA</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Donde el estilo se encuentra con la sustancia. Experimenta el arte del cuidado del cabello y uñas en elegancia moderna.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-white">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#servicios" className="hover:text-white transition-colors">Servicios</a></li>
              <li><a href="#estilistas" className="hover:text-white transition-colors">Nuestro Equipo</a></li>
              <li><a href="#galeria" className="hover:text-white transition-colors">Galería</a></li>
              <li><a href="#reservar" className="hover:text-white transition-colors">Reservas</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-white">Contacto</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <Phone size={16} />
                <span>(593) 2 123-4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} />
                <span>hola@luma.ec</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-1" />
                <span>Calle Belleza 123<br />Quito, Pichincha</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-white">Horarios</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex justify-between">
                <span>Lun - Vie</span>
                <span>9AM - 8PM</span>
              </li>
              <li className="flex justify-between">
                <span>Sábado</span>
                <span>10AM - 6PM</span>
              </li>
              <li className="flex justify-between">
                <span>Domingo</span>
                <span>Cerrado</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            © 2024 Luma. Todos los derechos reservados.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:bg-white hover:text-black transition-colors">
              <Instagram size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:bg-white hover:text-black transition-colors">
              <Facebook size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:bg-white hover:text-black transition-colors">
              <Mail size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
