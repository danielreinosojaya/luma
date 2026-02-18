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
      {/* Navigation */}
      <Navigation mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

      {/* Hero */}
      <Hero />

      {/* Services */}
      <Services />

      {/* Stylists */}
      <Stylists />

      {/* Testimonials */}
      <Testimonials />

      {/* Gallery */}
      <Gallery />

      {/* Booking */}
      <Booking />

      {/* Footer */}
      <Footer />
    </div>
  );
}

// ============================================================
// NAVIGATION
// ============================================================
function Navigation({ mobileMenuOpen, setMobileMenuOpen }: any) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="border-2 border-black px-3 py-1">
            <span className="font-serif text-xl tracking-wider">LUMIÈRE</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm">
          <a href="#services" className="hover:opacity-60 transition-opacity">Services</a>
          <a href="#stylists" className="hover:opacity-60 transition-opacity">Stylists</a>
          <a href="#gallery" className="hover:opacity-60 transition-opacity">Gallery</a>
          <a href="#booking" className="hover:opacity-60 transition-opacity">Book</a>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <button className="hover:opacity-60 transition-opacity">
            <Search size={20} />
          </button>
          <button className="hover:opacity-60 transition-opacity">
            <User size={20} />
          </button>
          <button className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors text-sm font-medium">
            Book Now
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-6 py-4 space-y-4">
            <a href="#services" className="block text-sm hover:opacity-60">Services</a>
            <a href="#stylists" className="block text-sm hover:opacity-60">Stylists</a>
            <a href="#gallery" className="block text-sm hover:opacity-60">Gallery</a>
            <a href="#booking" className="block text-sm hover:opacity-60">Book</a>
            <button className="w-full bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors text-sm">
              Book Now
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

// ============================================================
// HERO SECTION
// ============================================================
function Hero() {
  return (
    <section className="pt-32 pb-20 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-xs text-gray-500 mb-12 flex items-center gap-2">
          <div className="h-px w-8 bg-gray-400" />
          EST. 2024
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-7xl md:text-8xl font-serif leading-none mb-6">
              Redefine<br />
              <span className="italic text-rose-300">Your</span> Beauty
            </h1>

            <p className="text-gray-600 text-lg mb-8 max-w-md leading-relaxed">
              Experience the art of hair and nail care in a sanctuary designed for modern elegance. Where style meets substance.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <button className="bg-black text-white px-8 py-4 rounded-full hover:bg-gray-800 transition-all hover:scale-105 font-medium">
                Book Appointment
              </button>
              <button className="border-2 border-black px-8 py-4 rounded-full hover:bg-black hover:text-white transition-all flex items-center gap-2 group font-medium">
                View Services
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="flex items-center gap-12">
              <div>
                <div className="text-4xl font-serif mb-1">5k+</div>
                <div className="text-sm text-gray-500">Happy Clients</div>
              </div>
              <div>
                <div className="text-4xl font-serif mb-1">4.9</div>
                <div className="text-sm text-gray-500">Rating</div>
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
                <div className="text-xs text-gray-500">Stylist Available</div>
                <div className="font-semibold">Book Sarah</div>
              </div>
            </div>

            <div className="absolute top-12 -right-6 bg-teal-50 rounded-2xl shadow-lg p-6 max-w-[200px]">
              <div className="bg-white p-2 rounded-full w-fit mb-3">
                <div className="text-2xl">💅</div>
              </div>
              <div className="font-serif text-xl mb-1">Nail Artistry</div>
              <div className="text-sm text-gray-600 mb-2">Manicure & Pedicure</div>
              <div className="h-1 bg-teal-400 rounded-full w-3/4" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// SERVICES SECTION
// ============================================================
function Services() {
  const services = [
    {
      title: 'Color & Treatment',
      description: 'Balayage, Ombre, Keratin & more.',
      price: 'From $85',
      color: 'bg-teal-50',
      icon: Droplet,
    },
    {
      title: 'Nail Artistry',
      description: 'Gel, Acrylic, & Custom Art.',
      price: 'From $45',
      color: 'bg-purple-50',
      icon: Sparkles,
    },
    {
      title: 'Signature Hair Styling',
      description: 'Cuts, Blowouts, & Styling.',
      price: 'From $65',
      color: 'bg-rose-50',
      icon: ArrowRight,
    },
  ];

  const tickerItems = [
    'CUT & STYLE',
    'COLOR TREATMENT',
    'NAIL ARTISTRY',
    'BRIDAL PACKAGES',
    'SPA PEDICURE',
    'HAIR EXTENSIONS',
    'CUT & STYLE',
    'COLOR TREATMENT',
    'NAIL ARTISTRY',
  ];

  return (
    <section id="services" className="py-24 bg-white">
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
            <h2 className="text-5xl md:text-6xl font-serif mb-4">Curated Services</h2>
            <p className="text-gray-600 max-w-md">
              Select from our wide range of premium hair and nail treatments designed to make you shine.
            </p>
          </div>
          <button className="hidden md:flex items-center gap-2 text-sm hover:gap-4 transition-all font-medium">
            View Full Menu
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
              <h3 className="text-2xl font-serif mb-2">Signature Hair Styling</h3>
              <p className="text-sm text-gray-300 mb-3">Cuts, Blowouts, & Styling</p>
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
                NEW CLIENT
              </div>
              <h3 className="text-4xl font-serif mb-4">Get 20% Off Your First Visit</h3>
              <p className="text-gray-300 mb-6">
                Experience luxury for less. Book any hair or nail service today.
              </p>
              <button className="bg-white text-black px-8 py-3 rounded-full hover:bg-gray-100 transition-colors font-medium">
                Claim Offer
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
// STYLISTS SECTION
// ============================================================
function Stylists() {
  const stylists = [
    {
      name: 'Elena Rodriguez',
      role: 'Master Stylist',
      specialty: 'Specializes in balayage and precision cuts.',
      image: 'https://images.pexels.com/photos/3065171/pexels-photo-3065171.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 5,
    },
    {
      name: 'Marcus Chen',
      role: 'Nail Technician',
      specialty: 'Expert in intricate nail art and gel extensions.',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 5,
    },
    {
      name: 'Sarah James',
      role: 'Colorist',
      specialty: 'Vivid colors and corrective color specialist.',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 5,
    },
    {
      name: 'Amara Okafor',
      role: 'Bridal Specialist',
      specialty: 'Bridal hair and makeup expert.',
      image: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 5,
    },
  ];

  return (
    <section id="stylists" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-5xl md:text-6xl font-serif mb-4">Our Artists</h2>
            <p className="text-gray-600">Meet the experts behind the magic.</p>
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
                Book with {stylist.name.split(' ')[0]}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// TESTIMONIALS SECTION
// ============================================================
function Testimonials() {
  const testimonials = [
    {
      text: "Absolutely the best salon experience I've ever had. The atmosphere is stunning and my hair has never looked better.",
      author: 'Jessica M.',
      role: 'Regular Client',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
    {
      text: "The nail art here is next level. Marcus is a true artist. I get compliments everywhere I go!",
      author: 'Ashley T.',
      role: 'Nail Enthusiast',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
    {
      text: "From the moment you walk in, you feel pampered. The team is professional and the results are always flawless.",
      author: 'David K.',
      role: 'New Client',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <h2 className="text-5xl md:text-6xl font-serif mb-4">Client Love</h2>
          <p className="text-gray-400 max-w-2xl">
            Don't just take our word for it. Here is what our community has to say about their experience.
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
// GALLERY SECTION
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
    <section id="gallery" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl font-serif mb-4">Instagram Gallery</h2>
          <p className="text-gray-600 mb-6">
            Follow us for daily inspiration and exclusive behind-the-scenes content
          </p>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm hover:opacity-60 transition-opacity font-medium"
          >
            <Instagram size={20} />
            @lumiere.salon
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
// BOOKING SECTION
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
    <section id="booking" className="py-24 bg-gradient-to-br from-rose-50 via-white to-teal-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-5xl md:text-6xl font-serif mb-6">
              Ready for your transformation?
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Book your appointment online in seconds. Choose your service, stylist, and preferred time.
            </p>

            <div className="bg-white rounded-3xl shadow-xl p-8">
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none transition-colors"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="relative">
                  <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    placeholder="Phone Number"
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
                  <option>Select Service</option>
                  <option>Hair Cut & Style</option>
                  <option>Color Treatment</option>
                  <option>Nail Artistry</option>
                  <option>Bridal Package</option>
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
                    <option>Time</option>
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
                Check Availability
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
                  <div className="font-semibold">Lumière Salon</div>
                  <div className="text-sm text-green-500 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                    Open Now
                  </div>
                </div>
                <button className="ml-auto">
                  <Heart size={20} className="text-rose-500 fill-rose-500" />
                </button>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 mb-4">
                <p className="text-sm mb-3">
                  Hi there! 👋 How can we help you look your best today?
                </p>
              </div>

              <div className="bg-black text-white rounded-2xl rounded-br-sm p-4 mb-4 ml-auto max-w-[85%]">
                <p className="text-sm">
                  I'd like to book a haircut for tomorrow.
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 mb-4">
                <p className="text-sm mb-3">
                  Great! We have an opening at 2:00 PM with Elena. Does that work?
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
                    <div className="text-sm font-semibold">Signature Cut</div>
                    <div className="text-xs text-gray-500">with Elena</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-full focus:border-black focus:outline-none text-sm"
                />
                <button className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors text-sm font-medium">
                  Send
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
// FOOTER SECTION
// ============================================================
function Footer() {
  return (
    <footer className="bg-black text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="border-2 border-white px-3 py-1 w-fit mb-6">
              <span className="font-serif text-xl tracking-wider">LUMIÈRE</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Where style meets substance. Experience the art of hair and nail care in modern elegance.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#services" className="hover:text-white transition-colors">Services</a></li>
              <li><a href="#stylists" className="hover:text-white transition-colors">Our Team</a></li>
              <li><a href="#gallery" className="hover:text-white transition-colors">Gallery</a></li>
              <li><a href="#booking" className="hover:text-white transition-colors">Booking</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-white">Contact</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <Phone size={16} />
                <span>(555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} />
                <span>hello@lumiere.salon</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-1" />
                <span>123 Beauty Lane<br />New York, NY 10001</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-white">Hours</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex justify-between">
                <span>Mon - Fri</span>
                <span>9AM - 8PM</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday</span>
                <span>10AM - 6PM</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday</span>
                <span>Closed</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            © 2024 Lumière Salon. All rights reserved.
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
