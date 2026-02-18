# 🤖 INSTRUCCIONES PARA AGENTE DE IA - DISEÑO ESTILO MAISON

*Guía para generar diseños UI/UX premium estilo Awwwards*

---

## 🎯 OBJETIVO

Cuando el usuario diga **"quiero este tipo de diseño"** o **"diseño estilo MAISON"**, debes crear componentes web con las siguientes características:

---

## 📋 CONFIGURACIÓN INICIAL OBLIGATORIA

### 1. Stack Tecnológico

```bash
# Instalar dependencias core
npm install react framer-motion tailwindcss lucide-react sonner

# Si es proyecto nuevo
npx create-react-app nombre-proyecto
cd nombre-proyecto
npm install framer-motion lucide-react
npx tailwindcss init
```

### 2. Configuración Tailwind

**Archivo: `tailwind.config.js`**

```javascript
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['"Space Grotesk"', 'Arial', 'sans-serif'],
      },
      colors: {
        'salon-dark': '#1e1919',
        'salon-cream': '#f7f5f2',
        'salon-accent': '#61525a',
        'salon-subtle': '#736c64',
        'salon-subtle-dark': '#bbb5ae',
      },
    },
  },
  plugins: [],
};
```

### 3. Fuentes Google

**En el HTML o index.html:**

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&display=swap" rel="stylesheet" />
```

### 4. CSS Global

**Archivo: `App.css` o `globals.css`**

```css
/* ---- Tipografía ---- */
.font-display {
  font-family: 'Cormorant Garamond', Georgia, serif;
}

.font-body {
  font-family: 'Space Grotesk', Arial, sans-serif;
}

/* ---- Hero Title ---- */
.hero-title {
  font-size: clamp(4rem, 12vw, 14rem);
  line-height: 0.9;
  font-weight: 500;
  letter-spacing: 0.08em;
}

/* ---- Smooth Scrolling ---- */
html {
  scroll-behavior: smooth;
}

/* ---- Selection Color ---- */
::selection {
  background-color: #61525a;
  color: #f7f5f2;
}

/* ---- Custom Scrollbar ---- */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f7f5f2;
}

::-webkit-scrollbar-thumb {
  background: #61525a;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #4a3d44;
}

/* ---- Grain Texture Overlay (Opcional) ---- */
.grain-overlay::before {
  content: '';
  position: fixed;
  top: -50%;
  left: -50%;
  right: -50%;
  bottom: -50%;
  width: 200%;
  height: 200%;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 9998;
  opacity: 0.4;
}
```

---

## 🎨 REGLAS DE DISEÑO FUNDAMENTALES

### PALETA DE COLORES

**SIEMPRE usar estos colores:**

```jsx
// Fondos
bg-salon-cream       // #f7f5f2 - Fondo claro (secciones principales)
bg-salon-dark        // #1e1919 - Fondo oscuro (secciones alternas)

// Textos
text-salon-dark      // Negro cálido sobre fondos claros
text-white           // Blanco sobre fondos oscuros
text-salon-subtle    // Gris para texto secundario

// Acentos
bg-salon-accent      // #61525a - Bordes, hover states
bg-[#fad24b]         // Amarillo dorado - Elementos destacados
```

**Patrón de alternancia:**
```
Sección 1: bg-salon-cream (claro)
Sección 2: bg-salon-dark (oscuro)
Sección 3: bg-salon-cream (claro)
... y así sucesivamente
```

---

### TIPOGRAFÍA

#### Jerarquía de Texto

**Títulos Gigantes (Hero):**
```jsx
className="hero-title font-display text-salon-dark"
// Resultado: 64px-224px responsive, tracking ancho
```

**Headers de Sección (H2):**
```jsx
className="text-4xl md:text-5xl lg:text-6xl font-display text-salon-dark tracking-wide leading-tight"
// Tamaños: 36px → 48px → 60px
```

**Subtítulos (H3):**
```jsx
className="text-xl md:text-2xl font-display tracking-wide"
// 20px → 24px
```

**Body Text:**
```jsx
className="text-base md:text-lg font-body leading-relaxed"
// 16px → 18px, line-height generoso
```

**Labels/Categorías:**
```jsx
className="text-xs tracking-[0.3em] uppercase font-body text-salon-subtle"
// 12px, uppercase, tracking MUY ancho (30%)
```

**Regla de Oro:**
- **Display font** (Cormorant Garamond): Títulos, números grandes, nombres de marca
- **Body font** (Space Grotesk): Todo lo demás (navegación, cuerpo, botones)

---

### ESPACIADO CONSISTENTE

**Padding de Secciones:**
```jsx
className="px-6 md:px-12 py-20 md:py-32"
// Horizontal: 24px → 48px
// Vertical: 80px → 128px
```
**USAR EN TODAS LAS SECCIONES**

**Gaps en Grids:**
```jsx
gap-4 md:gap-6        // Items pequeños (16px → 24px)
gap-8 md:gap-12       // Items medianos (32px → 48px)
gap-16 md:gap-24      // Columnas grandes (64px → 96px)
```

---

## 🧩 COMPONENTES ESENCIALES

### 1. HEADER (Navegación Fija)

```jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.5, 0, 0.05, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
        isScrolled
          ? "bg-[#f7f5f2]/90 backdrop-blur-xl shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="flex items-center justify-between px-6 md:px-12 py-5">
        {/* Logo */}
        <a href="#" className="font-display text-2xl tracking-[0.15em] text-salon-dark font-medium">
          MARCA
        </a>

        {/* Nav Desktop */}
        <nav className="hidden lg:flex items-center gap-10">
          {["About", "Services", "Gallery", "Contact"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm tracking-wider text-salon-subtle hover:text-salon-dark transition-colors duration-300 uppercase font-body"
            >
              {item}
            </a>
          ))}
        </nav>

        {/* CTA Button */}
        <button className="hidden md:flex items-center gap-2 px-6 py-2.5 bg-salon-dark text-white text-sm tracking-wider uppercase rounded-none hover:bg-salon-accent transition-colors duration-300 font-body">
          Get Started
          <ArrowUpRight size={14} />
        </button>

        {/* Hamburger */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden">
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </motion.header>
  );
};
```

**Características clave:**
- ✅ Fixed position
- ✅ Transparente → Glassmorphism en scroll
- ✅ Animación de entrada (slide down)
- ✅ Hamburger para mobile

---

### 2. HERO SECTION (Título Cinematográfico)

```jsx
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

export const HeroSection = ({ title = "MARCA" }) => {
  const letters = title.split("");

  return (
    <section className="relative min-h-screen bg-salon-cream flex flex-col justify-between overflow-hidden">
      {/* Grid Lines Decorativas */}
      <div className="absolute inset-0 pointer-events-none">
        {[25, 50, 75].map((pos, i) => (
          <motion.div
            key={`v-${i}`}
            className="absolute top-0 bottom-0 w-px bg-salon-accent/20"
            style={{ left: `${pos}%` }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.2, delay: 0.3 + i * 0.15, ease: [0.5, 0, 0.05, 1] }}
          />
        ))}
      </div>

      {/* Top Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="pt-28 md:pt-32 px-6 md:px-12 flex justify-between items-start"
      >
        <span className="text-xs tracking-[0.3em] text-salon-subtle uppercase font-body">
          2025
        </span>
        <span className="text-xs tracking-[0.3em] text-salon-subtle uppercase font-body hidden md:block">
          Premium Experience
        </span>
      </motion.div>

      {/* Main Title */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        <div className="flex overflow-hidden">
          {letters.map((letter, i) => (
            <motion.span
              key={i}
              initial={{ y: 200, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 1,
                delay: 0.2 + i * 0.08,
                ease: [0.5, 0, 0.05, 1],
              }}
              className="hero-title font-display text-salon-dark inline-block"
            >
              {letter}
            </motion.span>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-6 text-lg md:text-xl text-salon-subtle font-body tracking-wide text-center max-w-xl"
        >
          Your tagline here
        </motion.p>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="mt-8 w-16 h-px bg-salon-accent"
        />
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
        className="pb-10 flex flex-col items-center gap-3"
      >
        <span className="text-xs tracking-[0.3em] text-salon-subtle uppercase font-body">
          Scroll to explore
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ArrowDown size={16} className="text-salon-subtle" />
        </motion.div>
      </motion.div>
    </section>
  );
};
```

**Características clave:**
- ✅ Animación letra por letra (split text)
- ✅ Grid lines decorativas animadas
- ✅ Scroll indicator con bounce
- ✅ Espaciado generoso

---

### 3. SECTION CON SCROLL-REVEAL (Template Base)

```jsx
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export const GenericSection = ({ title, children, isDark = false }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className={`relative ${isDark ? 'bg-salon-dark' : 'bg-salon-cream'}`}>
      <div className="px-6 md:px-12 py-20 md:py-32">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        >
          <span className={`text-xs tracking-[0.3em] uppercase font-body ${
            isDark ? 'text-salon-subtle-dark' : 'text-salon-subtle'
          }`}>
            Section Label
          </span>
          <h2 className={`mt-4 text-4xl md:text-5xl font-display tracking-wide ${
            isDark ? 'text-white' : 'text-salon-dark'
          }`}>
            {title}
          </h2>
        </motion.div>

        {children}
      </div>
    </section>
  );
};
```

**Uso:**
```jsx
<GenericSection title="About Us" isDark={true}>
  {/* Tu contenido aquí */}
</GenericSection>
```

---

### 4. SERVICE TILES (Bento Box Grid)

```jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const ServiceTile = ({ service, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: index * 0.08 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative overflow-hidden cursor-pointer"
      style={{ backgroundColor: service.color }}
    >
      {/* Imagen en hover */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${service.image})` }}
        animate={{
          opacity: isHovered ? 0.25 : 0,
          scale: isHovered ? 1 : 1.1,
        }}
        transition={{ duration: 0.6 }}
      />

      {/* Content */}
      <div className="relative z-10 p-8 md:p-10 min-h-[280px] flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <span className="text-xs tracking-[0.2em] uppercase opacity-70 font-body">
            {service.category}
          </span>
          <motion.div animate={{ rotate: isHovered ? 45 : 0 }}>
            <ArrowUpRight size={20} />
          </motion.div>
        </div>

        <div>
          <h3 className="text-xl md:text-2xl font-display tracking-wide mb-2">
            {service.title}
          </h3>
          <motion.p
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="text-sm font-body leading-relaxed opacity-80"
          >
            {service.description}
          </motion.p>
        </div>
      </div>

      {/* Borde inferior animado */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[3px] bg-current"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isHovered ? 1 : 0 }}
      />
    </motion.div>
  );
};

export const ServicesGrid = ({ services }) => {
  return (
    <section className="relative bg-salon-cream">
      <div className="px-6 md:px-12 py-16 md:py-24">
        {/* Header */}
        <div className="mb-12">
          <span className="text-xs tracking-[0.3em] text-salon-subtle uppercase font-body">
            Services
          </span>
          <h2 className="mt-4 text-4xl md:text-5xl font-display text-salon-dark tracking-wide">
            What We Offer
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <ServiceTile key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
```

**Formato de datos esperado:**
```javascript
const services = [
  {
    id: 1,
    title: "Service Name",
    category: "Category",
    description: "Short description here",
    color: "#e8d5c4",  // Cada tile su color único
    image: "https://images.unsplash.com/..."
  },
  // ...más servicios
];
```

---

### 5. FORMULARIO DE CONTACTO

```jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Aquí integrar con backend o servicio
  };

  return (
    <section className="relative bg-salon-cream">
      <div className="px-6 md:px-12 py-20 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24">
          {/* Left - CTA */}
          <div className="flex flex-col justify-center">
            <span className="text-xs tracking-[0.3em] text-salon-subtle uppercase font-body">
              Get In Touch
            </span>
            <h2 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-display text-salon-dark tracking-wide leading-tight">
              Let's Work
              <br />
              <span className="italic font-light">Together</span>
            </h2>
            <p className="mt-8 text-salon-subtle font-body text-base md:text-lg leading-relaxed max-w-lg">
              Ready to start your project? Get in touch and we'll create something amazing together.
            </p>
          </div>

          {/* Right - Form */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs tracking-[0.2em] text-salon-subtle uppercase font-body mb-3">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-transparent border-b border-salon-dark/20 py-3 text-salon-dark font-body text-base focus:outline-none focus:border-salon-accent transition-colors duration-300 placeholder:text-salon-subtle/40"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-xs tracking-[0.2em] text-salon-subtle uppercase font-body mb-3">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-transparent border-b border-salon-dark/20 py-3 text-salon-dark font-body text-base focus:outline-none focus:border-salon-accent transition-colors duration-300 placeholder:text-salon-subtle/40"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-xs tracking-[0.2em] text-salon-subtle uppercase font-body mb-3">
                  Message
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="w-full bg-transparent border-b border-salon-dark/20 py-3 text-salon-dark font-body text-base focus:outline-none focus:border-salon-accent transition-colors duration-300 placeholder:text-salon-subtle/40 resize-none"
                  placeholder="Tell us about your project..."
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-4 flex items-center justify-center gap-3 px-8 py-4 bg-salon-dark text-white text-sm tracking-[0.2em] uppercase font-body hover:bg-salon-accent transition-colors duration-300"
              >
                Send Message
                <ArrowUpRight size={16} />
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
```

**Características:**
- ✅ Inputs con border-bottom (minimal style)
- ✅ Sin backgrounds en inputs
- ✅ Focus state con color accent
- ✅ Button con micro-animaciones

---

### 6. FOOTER COMPLETO

```jsx
import { ArrowUpRight } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="relative bg-salon-dark border-t border-white/10">
      <div className="px-6 md:px-12 py-16 md:py-20">
        {/* Grid de 4 columnas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16">
          {/* Brand */}
          <div>
            <h3 className="font-display text-2xl tracking-[0.15em] text-white mb-4">
              MARCA
            </h3>
            <p className="text-salon-subtle-dark font-body text-sm leading-relaxed">
              Your brand tagline or mission statement here.
            </p>
            <div className="mt-6 w-12 h-px bg-salon-accent/40" />
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs tracking-[0.3em] text-white/60 uppercase font-body mb-6">
              Navigate
            </h4>
            <nav className="space-y-3">
              {["About", "Services", "Gallery", "Contact"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="block text-sm text-salon-subtle-dark font-body tracking-wider hover:text-white transition-colors duration-300"
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-xs tracking-[0.3em] text-white/60 uppercase font-body mb-6">
              Hours
            </h4>
            <div className="space-y-3">
              <div>
                <span className="block text-sm text-white/80 font-body tracking-wider">
                  Monday - Friday
                </span>
                <span className="text-xs text-salon-subtle-dark font-body">
                  9:00 AM - 6:00 PM
                </span>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs tracking-[0.3em] text-white/60 uppercase font-body mb-6">
              Contact
            </h4>
            <div className="space-y-3">
              <a href="tel:+1234567890" className="block text-sm text-salon-subtle-dark font-body tracking-wider hover:text-white transition-colors duration-300">
                +1 (234) 567-890
              </a>
              <a href="mailto:hello@example.com" className="block text-sm text-salon-subtle-dark font-body tracking-wider hover:text-white transition-colors duration-300">
                hello@example.com
              </a>
            </div>

            {/* Social */}
            <div className="mt-6 flex gap-4">
              {["Instagram", "Twitter", "LinkedIn"].map((platform) => (
                <a
                  key={platform}
                  href="#"
                  className="text-xs text-salon-subtle-dark font-body tracking-wider hover:text-white transition-colors duration-300 flex items-center gap-1"
                >
                  {platform}
                  <ArrowUpRight size={10} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 md:mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/30 font-body tracking-wider">
            &copy; 2025 Your Brand. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-white/30 font-body tracking-wider hover:text-white/60 transition-colors duration-300">
              Privacy Policy
            </a>
            <a href="#" className="text-xs text-white/30 font-body tracking-wider hover:text-white/60 transition-colors duration-300">
              Terms of Service
            </a>
          </div>
        </div>
      </div>

      {/* Large Watermark */}
      <div className="px-6 md:px-12 pb-12">
        <span className="block text-[8vw] md:text-[6vw] font-display text-white/5 tracking-[0.1em] leading-none">
          MARCA
        </span>
      </div>
    </footer>
  );
};
```

---

## 🎬 PATRONES DE ANIMACIÓN

### Pattern 1: Scroll-Triggered Fade-In

```jsx
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const ref = useRef(null);
const isInView = useInView(ref, { once: true, margin: "-100px" });

<motion.div
  ref={ref}
  initial={{ opacity: 0, y: 40 }}
  animate={isInView ? { opacity: 1, y: 0 } : {}}
  transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
>
  {/* Tu contenido */}
</motion.div>
```

**Usar en:** Títulos de sección, párrafos, imágenes

---

### Pattern 2: Stagger Children

```jsx
{items.map((item, index) => (
  <motion.div
    key={item.id}
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, delay: index * 0.08 }}
  >
    {/* Card o item */}
  </motion.div>
))}
```

**Usar en:** Grids, listas de cards, galerías

---

### Pattern 3: Hover Scale (Botones)

```jsx
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  className="..."
>
  Button Text
</motion.button>
```

**Usar en:** Todos los botones

---

### Pattern 4: Image Zoom Hover

```jsx
<motion.img
  src={imageUrl}
  alt={alt}
  whileHover={{ scale: 1.05 }}
  transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
  className="w-full h-full object-cover"
/>
```

**Usar en:** Galerías, portfolios

---

### Pattern 5: Line Scale Animation

```jsx
<motion.div
  initial={{ scaleX: 0 }}
  animate={{ scaleX: 1 }}
  transition={{ duration: 0.8, ease: [0.5, 0, 0.05, 1] }}
  className="h-px bg-salon-accent"
/>
```

**Usar en:** Líneas decorativas, separadores

---

## 📐 LAYOUTS COMUNES

### Layout 1: Two Column (Text + Image)

```jsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24">
  <div className="flex flex-col justify-center">
    {/* Text content */}
  </div>
  <div className="relative">
    {/* Image */}
  </div>
</div>
```

---

### Layout 2: Three Column Grid

```jsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
  {items.map((item) => (
    <div key={item.id}>{/* Card */}</div>
  ))}
</div>
```

---

### Layout 3: Four Column Bento Box

```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
  {services.map((service) => (
    <div key={service.id} style={{ backgroundColor: service.color }}>
      {/* Tile sin gap */}
    </div>
  ))}
</div>
```

---

### Layout 4: Masonry Gallery

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
  {images.map((image, index) => (
    <div
      key={image.id}
      className={index % 3 === 0 ? "md:row-span-2" : ""}
    >
      <img src={image.url} alt={image.alt} className="w-full h-full object-cover" />
    </div>
  ))}
</div>
```

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

Cuando el usuario pida "este tipo de diseño", seguir este orden:

### Fase 1: Setup (5-10 min)
- [ ] Instalar dependencias (React, Framer Motion, Tailwind, Lucide)
- [ ] Configurar Tailwind con colores custom
- [ ] Agregar fuentes Google (Cormorant + Space Grotesk)
- [ ] Crear App.css con estilos base

### Fase 2: Estructura (20-30 min)
- [ ] Header fixed con glassmorphism
- [ ] Hero section con animación de letras
- [ ] Alternas secciones dark/light
- [ ] Footer completo

### Fase 3: Contenido (30-60 min)
- [ ] Sección About con scroll-reveal
- [ ] Services grid con tiles interactivos
- [ ] Gallery o portfolio (si aplica)
- [ ] Formulario de contacto

### Fase 4: Animaciones (15-20 min)
- [ ] useInView en todas las secciones
- [ ] Stagger en grids/listas
- [ ] Hover states en botones/cards
- [ ] Transitions suaves (duration 0.3-0.8s)

### Fase 5: Responsive (15-20 min)
- [ ] Mobile menu funcional
- [ ] Grids responsive (1 col → 2 col → 4 col)
- [ ] Padding/typography escalonados
- [ ] Test en 320px, 768px, 1024px, 1920px

### Fase 6: Polish (10-15 min)
- [ ] Custom scrollbar
- [ ] Selection color
- [ ] Grain texture (opcional)
- [ ] Loading states
- [ ] Error handling en forms

---

## 🚫 ERRORES A EVITAR

### ❌ NO HACER:

1. **Border radius en botones principales**
   ```jsx
   // MAL
   className="rounded-lg"
   
   // BIEN
   className="rounded-none"  // o sin rounded
   ```

2. **Sombras fuertes**
   ```jsx
   // MAL
   className="shadow-2xl"
   
   // BIEN
   className="shadow-sm"  // o sin shadow
   ```

3. **Animaciones muy rápidas**
   ```jsx
   // MAL
   transition={{ duration: 0.2 }}
   
   // BIEN
   transition={{ duration: 0.6 }}
   ```

4. **Tracking normal en labels**
   ```jsx
   // MAL
   className="uppercase text-xs"
   
   // BIEN
   className="uppercase text-xs tracking-[0.3em]"
   ```

5. **Padding inconsistente**
   ```jsx
   // MAL
   className="px-4 py-8"
   
   // BIEN
   className="px-6 md:px-12 py-20 md:py-32"
   ```

6. **Olvidar `once: true` en useInView**
   ```jsx
   // MAL (anima cada vez que entra)
   const isInView = useInView(ref);
   
   // BIEN (anima solo una vez)
   const isInView = useInView(ref, { once: true });
   ```

7. **Usar colores fuera de la paleta**
   ```jsx
   // MAL
   className="bg-blue-500 text-red-600"
   
   // BIEN
   className="bg-salon-dark text-salon-cream"
   ```

---

## 🎯 VALORES POR DEFECTO

### Cuando no se especifique, usar:

**Duración de animaciones:**
- Hover/pequeñas: `0.3s`
- Standard: `0.6-0.8s`
- Dramáticas: `1-1.2s`

**Easing:**
- General: `[0.4, 0, 0.2, 1]`
- Dramático: `[0.5, 0, 0.05, 1]`

**Delays en stagger:**
- `index * 0.08` (80ms entre elementos)

**Margin en useInView:**
- `"-100px"` (trigger 100px antes del viewport)

**Gaps:**
- Pequeños: `gap-4 md:gap-6`
- Medianos: `gap-8 md:gap-12`
- Grandes: `gap-16 md:gap-24`

**Padding de sección:**
- `px-6 md:px-12 py-20 md:py-32` (SIEMPRE)

---

## 📱 RESPONSIVE BREAKPOINTS

```javascript
// Tailwind defaults (usar estos)
sm: 640px   // Rara vez usado
md: 768px   // Tablet
lg: 1024px  // Desktop pequeño
xl: 1280px  // Desktop grande
```

**Patrón común:**
```jsx
// Mobile → Tablet → Desktop
className="text-base md:text-lg lg:text-xl"
className="grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
className="px-6 md:px-12 lg:px-16"
```

---

## 🔧 TROUBLESHOOTING

### Problema: Animaciones no se ven

**Solución:**
```jsx
// Verificar que Framer Motion esté instalado
import { motion } from "framer-motion";

// Verificar initial/animate
<motion.div
  initial={{ opacity: 0 }}  // ✅ Definido
  animate={{ opacity: 1 }}  // ✅ Definido
>
```

---

### Problema: useInView no funciona

**Solución:**
```jsx
import { useInView } from "framer-motion";  // ✅ Correcto
// NO: import { useInView } from "react-intersection-observer";

const ref = useRef(null);
const isInView = useInView(ref, { once: true, margin: "-100px" });

<motion.div ref={ref}>  // ✅ Ref asignado
```

---

### Problema: Tailwind classes no aplican

**Solución:**
```javascript
// Verificar tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",  // ✅ Path correcto
  ],
}
```

---

### Problema: Fuentes no cargan

**Solución:**
```html
<!-- Verificar en index.html -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=..." />
```

```javascript
// Verificar en tailwind.config.js
fontFamily: {
  display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
  body: ['"Space Grotesk"', 'Arial', 'sans-serif'],
}
```

---

## 🎓 PRINCIPIOS CLAVE A RECORDAR

### 1. **Minimalismo Sofisticado**
- Menos es más
- Espacios en blanco generosos
- Paleta restringida

### 2. **Tipografía como Héroe**
- Tamaños dramáticos en títulos
- Tracking ancho en labels
- Jerarquía clara

### 3. **Animaciones Fluidas**
- Nada instantáneo
- Easings custom
- Stagger para guiar la mirada

### 4. **Consistencia Absoluta**
- Mismo padding en todas las secciones
- Mismos colores siempre
- Patrones repetibles

### 5. **Mobile-First**
- Diseñar para mobile primero
- Agregar complejidad en desktop
- Touch-friendly (min 44px)

---

## 📚 RECURSOS RÁPIDOS

### Documentación:
- **Framer Motion:** https://www.framer.com/motion/
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Lucide Icons:** https://lucide.dev/icons

### Imágenes placeholder:
- **Unsplash:** `https://images.unsplash.com/photo-[ID]?w=800&q=80`
- **Picsum:** `https://picsum.photos/800/600`

### Colores adicionales sugeridos:
```javascript
// Pasteles suaves (para tiles)
'#e8d5c4'  // Beige
'#d4c5b9'  // Taupe
'#f2e6d9'  // Crema
'#c9b8a8'  // Café claro
'#e1d4c8'  // Arena
```

---

## ✨ RESULTADO FINAL

Al seguir estas instrucciones, crearás:

✅ Website premium estilo Awwwards
✅ Animaciones fluidas y sofisticadas
✅ Tipografía editorial dramática
✅ Layout minimalista con espacios generosos
✅ Responsive impecable
✅ Micro-interacciones en cada elemento
✅ Código limpio y mantenible

**Tiempo estimado:**
- Proyecto básico (5 secciones): 2-3 horas
- Proyecto completo (10 secciones): 5-7 horas
- Con contenido real y testing: 8-12 horas

---

## 🎯 COMANDO RÁPIDO DE INICIO

```bash
# Nuevo proyecto desde cero
npx create-react-app my-premium-site
cd my-premium-site
npm install framer-motion lucide-react
npm install -D tailwindcss
npx tailwindcss init

# Copiar configuraciones:
# - tailwind.config.js (con colores custom)
# - App.css (estilos globales)
# - index.html (fuentes Google)

npm start
```

---

*Última actualización: 2026*
*Instrucciones basadas en proyecto MAISON*
