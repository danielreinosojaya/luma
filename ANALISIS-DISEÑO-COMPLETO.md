# 📐 ANÁLISIS EXHAUSTIVO DE DISEÑO UI/UX - MAISON HAIR & NAILS ATELIER

*Documentación técnica completa para diseñadores gráficos*

---

## 🎨 RESUMEN EJECUTIVO

**Estilo de Diseño:** Awwwards-Style / Premium Luxury / Minimalismo Editorial

**Approach:** Diseño editorial premium con énfasis en tipografía cinematográfica, animaciones fluidas de alta gama, espacios en blanco generosos y micro-interacciones sofisticadas.

**Método:** Component-driven design con React + Framer Motion + Tailwind CSS

---

## 📖 TABLA DE CONTENIDOS

1. [Tipografía](#tipografía)
2. [Sistema de Colores](#sistema-de-colores)
3. [Espaciado y Grid](#espaciado-y-grid)
4. [Componentes Principales](#componentes-principales)
5. [Animaciones y Transiciones](#animaciones-y-transiciones)
6. [Efectos Visuales](#efectos-visuales)
7. [Responsive Design](#responsive-design)
8. [Librerías y Stack Tecnológico](#librerías-y-stack-tecnológico)
9. [Patrones de Diseño](#patrones-de-diseño)

---

## 📝 TIPOGRAFÍA

### Fuentes Utilizadas

#### **1. Cormorant Garamond** (Display/Headlines)
- **Tipo:** Serif editorial
- **Familia:** Google Fonts
- **Pesos usados:** 300, 400, 500, 600, 700 (regular e itálica)
- **Aplicación:** 
  - Títulos principales (Hero)
  - Headlines de secciones
  - Números destacados
  - Nombres de marca

**Implementación CSS:**
```css
.font-display {
  font-family: 'Cormorant Garamond', Georgia, serif;
}
```

**Config Tailwind:**
```javascript
fontFamily: {
  display: ['"Cormorant Garamond"', 'Georgia', 'serif']
}
```

#### **2. Space Grotesk** (Body/UI)
- **Tipo:** Sans-serif geométrica moderna
- **Familia:** Google Fonts
- **Pesos usados:** 300, 400, 500, 600, 700
- **Aplicación:**
  - Texto de cuerpo
  - Navegación
  - Labels de formularios
  - Botones
  - Descriptivos

**Implementación CSS:**
```css
.font-body {
  font-family: 'Space Grotesk', Arial, sans-serif;
}
```

### Jerarquía Tipográfica

#### **Hero Title (Super Headline)**
```css
.hero-title {
  font-size: clamp(4rem, 12vw, 14rem);  /* 64px - 224px */
  line-height: 0.9;                      /* Super compacto */
  font-weight: 500;                       /* Medium */
  letter-spacing: 0.08em;                 /* 8% tracking */
}
```

- **Responsive:** En mobile cambia a `clamp(3rem, 15vw, 6rem)`
- **Efecto:** Cada letra se anima individualmente con stagger
- **Propósito:** Impacto visual dramático, estilo editorial de alta gama

#### **Section Headers (H2)**
```jsx
className="text-4xl md:text-5xl lg:text-6xl font-display text-salon-dark tracking-wide leading-tight"
```
- **Tamaños:** 36px → 48px → 60px
- **Font:** Cormorant Garamond
- **Tracking:** `tracking-wide` (0.025em)
- **Leading:** `leading-tight` (1.25)

#### **Subsecciones (H3)**
```jsx
className="text-xl md:text-2xl font-display tracking-wide"
```
- **Tamaños:** 20px → 24px
- **Uso:** Cards de servicios, testimoniales

#### **Body Text**
```jsx
className="text-base md:text-lg font-body leading-relaxed"
```
- **Tamaños:** 16px → 18px
- **Leading:** `leading-relaxed` (1.625)
- **Font:** Space Grotesk

#### **Labels y Microcopias**
```jsx
className="text-xs tracking-[0.3em] uppercase font-body"
```
- **Tamaño:** 12px (0.75rem)
- **Transform:** Uppercase
- **Tracking:** 30% (0.3em) - Muy espaciado
- **Uso:** Categorías, labels de sección, metadatos

---

## 🎨 SISTEMA DE COLORES

### Paleta Principal

#### **1. Salon Dark** (Negro Cálido)
```javascript
'salon-dark': '#1e1919'
```
- **Uso:** Fondos oscuros, texto principal, botones primary
- **Contraste:** Alto sobre fondos claros
- **Aplicación:** Secciones About, Testimonios, Footer, Header en scroll

#### **2. Salon Cream** (Beige/Crema)
```javascript
'salon-cream': '#f7f5f2'
```
- **Uso:** Fondo principal, secciones claras
- **Temperatura:** Cálida, elegante
- **Aplicación:** Hero, Gallery, Services, Booking

#### **3. Salon Accent** (Marrón Lavanda)
```javascript
'salon-accent': '#61525a'
```
- **Uso:** Borders, hover states, líneas decorativas
- **Función:** Color de énfasis secundario
- **Opacidades comunes:** 20%, 40%, 60%

#### **4. Salon Subtle** (Gris Cálido)
```javascript
'salon-subtle': '#736c64'
```
- **Uso:** Texto secundario, labels
- **Aplicación:** Metadatos, descripciones, navegación inactiva

#### **5. Salon Subtle Dark** (Beige Claro)
```javascript
'salon-subtle-dark': '#bbb5ae'
```
- **Uso:** Texto sobre fondos oscuros
- **Contraste:** Moderado, para información secundaria

#### **6. Salon Line** (Azul Acento)
```javascript
'salon-line': '#5f9dff'
```
- **Uso:** Líneas de grid decorativas
- **Aplicación:** Overlays del hero section

### Colores de Acento Adicionales

#### **Gold/Yellow** (#fad24b)
- **Uso:** Bloques flotantes, estrellas de rating, puntos decorativos
- **Función:** Call-to-action visual, highlights

#### **Transparencias Semánticas**
```css
/* Overlays */
bg-salon-dark/0         /* Transparente */
bg-salon-dark/20        /* Overlay sutil */
bg-salon-dark/40        /* Overlay hover */
bg-salon-dark/90        /* Header con scroll */

/* Líneas y borders */
border-white/10         /* Border sutil en fondos oscuros */
border-white/20         /* Border hover */
border-salon-accent/20  /* Líneas decorativas */
```

### Estados de Color

#### **Text Colors**
```jsx
text-salon-dark         /* Negro principal */
text-salon-subtle       /* Gris medio */
text-white/80           /* Blanco suave */
text-white/40           /* Blanco muy transparente */
```

#### **Background Colors**
```jsx
bg-salon-cream          /* Fondo claro principal */
bg-salon-dark           /* Fondo oscuro principal */
bg-transparent          /* Header inicial */
bg-[#f7f5f2]/90        /* Header scrolled con blur */
```

---

## 📐 ESPACIADO Y GRID

### Sistema de Espaciado Tailwind

#### **Padding de Secciones**
```jsx
className="px-6 md:px-12 py-20 md:py-32"
```
- **Horizontal:** 24px → 48px
- **Vertical:** 80px → 128px
- **Consistencia:** Usado en TODAS las secciones principales

#### **Gaps en Grids**
```jsx
gap-16 md:gap-24        /* Entre columnas grandes: 64px → 96px */
gap-8 md:gap-12         /* Entre elementos: 32px → 48px */
gap-4 md:gap-6          /* Items compactos: 16px → 24px */
```

### Layout Grids

#### **Two Column Layout (Desktop)**
```jsx
className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24"
```
- **Uso:** About Section, Booking Section
- **Breakpoint:** lg (1024px)
- **Gap:** Generoso (64-96px)

#### **Three Column Layout**
```jsx
className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
```
- **Uso:** Testimonials
- **Breakpoint:** md (768px)

#### **Four Column Grid**
```jsx
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
```
- **Uso:** Services Grid, Stats Bar
- **Sin gaps:** Tiles adyacentes para efecto continuo

#### **Masonry Gallery**
```jsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
```
- **Feature:** Elementos dinámicos con `row-span-2` cada 3 items
- **Efecto:** Layout Pinterest-style con variación visual

### Grid Decorativo (Wireframe)

#### **Hero Section Grid Lines**
```jsx
{/* Verticales */}
{[25, 50, 75].map((pos, i) => (
  <motion.div
    className="absolute top-0 bottom-0 w-px bg-salon-accent/20"
    style={{ left: `${pos}%` }}
  />
))}

{/* Horizontales */}
{[33, 66].map((pos, i) => (
  <motion.div
    className="absolute left-0 right-0 h-px bg-salon-accent/20"
    style={{ top: `${pos}%` }}
  />
))}
```

**Características:**
- **Posiciones:** Cuartos verticales (25%, 50%, 75%), tercios horizontales (33%, 66%)
- **Grosor:** 1px
- **Color:** `salon-accent/20` (marrón lavanda al 20%)
- **Animación:** Scale desde 0 con stagger delays
- **Propósito:** Efecto blueprint/wireframe editorial

---

## 🧩 COMPONENTES PRINCIPALES

### 1. HEADER (Navegación Fija)

#### **Estructura**
```jsx
<motion.header
  className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
    isScrolled ? "bg-[#f7f5f2]/90 backdrop-blur-xl shadow-sm" : "bg-transparent"
  }`}
>
```

#### **Características de Diseño**

**Estados:**
- **Inicial:** Transparente, sin fondo
- **Scrolled:** Fondo crema semi-transparente (90%), backdrop blur (efecto glassmorphism)

**Layout:**
```
[LOGO]                    [NAV ITEMS]                    [BUTTONS] [HAMBURGER]
```

**Logo:**
```jsx
<span className="font-display text-2xl tracking-[0.15em] text-salon-dark font-medium">
  MAISON
</span>
<span className="hidden md:inline-block text-xs text-salon-subtle tracking-wider uppercase">
  Atelier
</span>
```

**Navegación Desktop:**
- Links en uppercase
- Tracking ancho (0.05-0.1em)
- Hover: transición de color `duration-300`
- Font: Space Grotesk

**Botón CTA:**
```jsx
className="hidden md:flex items-center gap-2 px-6 py-2.5 bg-salon-dark text-white text-sm tracking-wider uppercase rounded-none hover:bg-salon-accent transition-colors duration-300 font-body"
```
- Sin border-radius (rectangulares puros)
- Icono `ArrowUpRight` de lucide-react
- Hover: cambia de negro a marrón acento

**Mobile Menu:**
- Fullscreen overlay
- Fondo crema sólido
- Items centrados verticalmente
- Animación: fade + slide desde arriba
- Stagger en items (delay: i * 0.08)

#### **Animaciones**
```jsx
initial={{ y: -100 }}
animate={{ y: 0 }}
transition={{ duration: 0.8, ease: [0.5, 0, 0.05, 1] }}
```
- Slide down al cargar la página
- Easing custom: bezier dramático

---

### 2. HERO SECTION (Título Cinematográfico)

#### **Layout**
```
┌─────────────────────────────────┐
│ [META: 2025]     [TAGLINE]      │
│                                  │
│                                  │
│         M A I S O N             │  ← Animación letra por letra
│                                  │
│      Hair & Nails Atelier       │
│         ────────                 │
│                                  │
│    Scroll to explore ↓          │
└─────────────────────────────────┘
```

#### **Técnica Tipográfica: Split Text Animation**
```jsx
const nameLetters = salonData.name.split("");

{nameLetters.map((letter, i) => (
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
```

**Detalles:**
- Cada letra como span independiente
- Animación desde abajo (y: 200)
- Stagger delay: 0.08s entre letras
- Easing: Custom bezier para aceleración dramática
- Overflow hidden para efecto de cortina

#### **Elementos Decorativos**

**Grid Lines Animadas:**
- 3 líneas verticales (25%, 50%, 75%)
- 2 líneas horizontales (33%, 66%)
- Animación: scale desde 0 con delay secuencial
- Color: `bg-salon-accent/20`

**Accent Line (Decorativa):**
```jsx
<motion.div
  initial={{ scaleX: 0 }}
  animate={{ scaleX: 1 }}
  transition={{ delay: 1.6, duration: 0.8 }}
  className="mt-8 w-16 h-px bg-salon-accent"
/>
```
- Línea horizontal de 64px
- Expansión horizontal (scale-x)
- Posicionada bajo el subtítulo

**Scroll Indicator:**
```jsx
<motion.div
  animate={{ y: [0, 8, 0] }}
  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
>
  <ArrowDown size={16} className="text-salon-subtle" />
</motion.div>
```
- Bounce infinito suave
- Icono Lucide React

---

### 3. ABOUT SECTION (Dos Columnas + Imagen)

#### **Layout**
```
┌───────────────────────────────────────────┐
│  DARK BACKGROUND (#1e1919)                │
│                                           │
│  [TEXT COLUMN]        [IMAGE COLUMN]     │
│  - Label                 - Photo          │
│  - Title H2              - Floating       │
│  - Description             Badge "7+"     │
│  - Values List (01-04)                    │
│                                           │
│  ──────────────────────────────────────   │
│  [STATS BAR]                              │
│  500+    12    7+    98%                  │
└───────────────────────────────────────────┘
```

#### **Card de Valores (01-04)**
```jsx
<motion.div className="flex items-center gap-6 group">
  <span className="text-xs text-salon-accent/60 font-body tracking-wider">
    {value.number}     {/* 01 */}
  </span>
  <span className="text-white/80 group-hover:text-white">
    {value.label}      {/* Excellence */}
  </span>
  <motion.div className="flex-1 h-px bg-white/10 group-hover:bg-white/20" />
</motion.div>
```

**Características:**
- Número prefijo (01, 02, 03, 04)
- Línea horizontal que crece con hover
- Transición de opacidad en texto
- Layout flex con gap

#### **Floating Badge (Accent Block)**
```jsx
<motion.div
  className="absolute -bottom-8 -left-8 md:-left-12 bg-[#fad24b] p-6 md:p-8"
>
  <span className="text-3xl md:text-4xl font-display text-salon-dark block">
    7+
  </span>
  <span className="text-xs tracking-[0.2em] text-salon-dark/70 uppercase font-body">
    Years
  </span>
</motion.div>
```

**Diseño:**
- Color: Amarillo dorado (#fad24b)
- Posición: Absoluta, fuera del contenedor (overflow)
- Sin border-radius (rectangulares)
- Tipografía: Display para número, body para label
- Animación de entrada: slide up + fade

#### **Stats Bar**
```jsx
className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12"
```
- Border superior: `border-white/10`
- Números grandes: `text-3xl md:text-4xl font-display`
- Labels: uppercase + tracking ancho

---

### 4. SERVICES GRID (Tiles Interactivos Estilo DB Brand)

#### **Método de Diseño:** Bento Box / Swiss Grid

```
┌─────────┬─────────┬─────────┬─────────┐
│ Tile 1  │ Tile 2  │ Tile 3  │ Tile 4  │
│ [IMG]   │ [IMG]   │ [IMG]   │ [IMG]   │
└─────────┴─────────┴─────────┴─────────┘
```

#### **Service Tile Component**

**Estructura:**
```jsx
<motion.div
  onMouseEnter={() => setIsHovered(true)}
  style={{ backgroundColor: service.color }}
>
  {/* Background Image - Aparece en Hover */}
  <motion.div
    style={{ backgroundImage: `url(${service.image})` }}
    animate={{
      opacity: isHovered ? 0.25 : 0,
      scale: isHovered ? 1 : 1.1,
    }}
  />
  
  {/* Content */}
  <div className="p-8 md:p-10 min-h-[240px] md:min-h-[280px]">
    <div className="flex justify-between">
      <span>{service.category}</span>
      <ArrowUpRight />
    </div>
    
    <h3>{service.title}</h3>
    <motion.p
      animate={{ opacity: isHovered ? 1 : 0 }}
    >
      {service.description}
    </motion.p>
  </div>
  
  {/* Hover Border Accent */}
  <motion.div
    className="absolute bottom-0 h-[3px]"
    animate={{ scaleX: isHovered ? 1 : 0 }}
  />
</motion.div>
```

#### **Características de Diseño**

**Colores de Fondo Dinámicos:**
Cada tile tiene su propio color de marca:
- Ejemplos: #e8d5c4, #d4c5b9, #f2e6d9, etc.
- Se pasa como prop: `style={{ backgroundColor: service.color }}`

**Imagen de Fondo en Hover:**
- Opacity: 0 → 0.25 (overlay suave)
- Scale: 1.1 → 1 (zoom out al hover)
- Duración: 0.6s con custom easing

**Descripción Revelada:**
- Initial: opacity 0, y: 10
- Hover: opacity 1, y: 0
- Transición rápida: 0.3s

**Borde Inferior Animado:**
```jsx
<motion.div
  style={{ backgroundColor: service.textColor }}
  initial={{ scaleX: 0 }}
  animate={{ scaleX: isHovered ? 1 : 0 }}
  className="absolute bottom-0 h-[3px]"
/>
```
- Altura: 3px (no estándar de 1px)
- Animación horizontal (scaleX)
- Color: dinámico según textColor del servicio

**Icono Arrow:**
```jsx
<motion.div animate={{ rotate: isHovered ? 45 : 0 }}>
  <ArrowUpRight />
</motion.div>
```
- Rotación 45° en hover
- Transición suave 0.3s

---

### 5. GALLERY SECTION (Masonry Grid Filtrable)

#### **Filtros**
```jsx
<button
  className={`text-sm tracking-wider uppercase font-body pb-1 border-b-2 ${
    activeFilter === filter
      ? "text-salon-dark border-salon-accent"
      : "text-salon-subtle border-transparent hover:text-salon-dark"
  }`}
>
  {filter}
</button>
```

**Diseño:**
- Border inferior como indicador (no background)
- Transición all: color + border
- States: default, hover, active

#### **Masonry Layout**
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
  {filtered.map((item, index) => (
    <motion.div
      layout
      className={index % 3 === 0 ? "md:row-span-2" : ""}
    >
```

**Lógica:**
- Cada tercer item (index % 3 === 0) ocupa 2 filas
- Layout prop de Framer Motion para animaciones fluidas
- Aspect ratios dinámicos:
  - Largas: `aspect-[3/4]` o `md:h-full`
  - Anchas: `aspect-[4/3]`

#### **Image Card**

**Overlay en Hover:**
```jsx
<div className="absolute inset-0 bg-salon-dark/0 group-hover:bg-salon-dark/40" />
```
- Transparente → 40% negro
- Transición: `duration-500`

**Zoom en Imagen:**
```jsx
<motion.img
  whileHover={{ scale: 1.05 }}
  transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
/>
```
- Scale de 5%
- Easing custom suave

**Info Overlay:**
```jsx
<div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 opacity-0 group-hover:opacity-100">
  <span className="text-xs tracking-[0.2em] text-white/70 uppercase">
    {item.category}
  </span>
  <h3 className="text-xl md:text-2xl font-display text-white">
    {item.title}
  </h3>
</div>
```
- Posicionado en bottom
- Fade in completo en hover
- Tipografía jerárquica (label + title)

---

### 6. TESTIMONIALS SECTION (Cards con Rating)

#### **Card Structure**
```
┌───────────────────────────┐
│ ★★★★★                     │  ← Rating estrellas
│                           │
│ "Quote text aquí..."      │
│                           │
│ [Avatar] Name             │
│          Role             │
│                           │
│                      [⌟]  │  ← Accent corner
└───────────────────────────┘
```

#### **Testimonial Card**

**Border y Hover:**
```jsx
className="p-8 md:p-10 border border-white/10 hover:border-white/20"
```
- Borders sutiles sobre fondo oscuro
- Transición suave en hover: `duration-500`

**Stars Component:**
```jsx
{Array(testimonial.rating).fill(null).map((_, i) => (
  <Star key={i} size={14} className="fill-[#fad24b] text-[#fad24b]" />
))}
```
- Icono: Lucide React
- Color: Gold (#fad24b)
- Fill + stroke del mismo color

**Avatar Placeholder:**
```jsx
<div className="w-10 h-10 rounded-full bg-salon-accent/20">
  <span className="text-white/80 font-display text-sm">
    {testimonial.name.charAt(0)}
  </span>
</div>
```
- Circular (rounded-full)
- Fondo: accent color al 20%
- Inicial del nombre centrada

**Accent Corner (Decorativo):**
```jsx
<div className="absolute top-0 right-0 w-12 h-12 opacity-0 group-hover:opacity-100">
  <div className="absolute top-0 right-0 w-full h-px bg-[#fad24b]" />
  <div className="absolute top-0 right-0 h-full w-px bg-[#fad24b]" />
</div>
```
- Líneas en L en esquina superior derecha
- Gold color
- Aparece solo en hover
- Efecto de "sello de calidad"

---

### 7. BOOKING SECTION (Formulario Premium)

#### **Layout: Dos Columnas**
```
┌───────────────────────────────────────────┐
│ [CTA TEXT]           [FORM]               │
│ - Title                - Name input       │
│ - Description          - Email input      │
│ - Contact Info         - Service select   │
│                        - Message textarea │
│                        - Submit button    │
└───────────────────────────────────────────┘
```

#### **Form Inputs (Estilo Minimalista)**

**Text Input:**
```jsx
<input
  className="w-full bg-transparent border-b border-salon-dark/20 py-3 text-salon-dark font-body text-base focus:outline-none focus:border-salon-accent transition-colors duration-300 placeholder:text-salon-subtle/40"
/>
```

**Características:**
- Sin background (transparente)
- Solo border inferior (underline style)
- Sin border-radius
- Focus: cambia color de border a accent
- Placeholder: texto sutil al 40%
- Sin outline nativo del browser

**Label Style:**
```jsx
<label className="block text-xs tracking-[0.2em] text-salon-subtle uppercase font-body mb-3">
  Name *
</label>
```
- Uppercase
- Tracking ancho (20%)
- Asterisco para campos requeridos
- Espaciado inferior: 12px

**Select Dropdown:**
```jsx
<select className="...appearance-none cursor-pointer">
  <option value="">Select a service</option>
  {salonData.services.map(s => (
    <option key={s.id} value={s.title}>{s.title}</option>
  ))}
</select>
```
- `appearance-none`: sin estilo nativo
- Cursor pointer
- Mismo estilo que inputs

**Textarea:**
```jsx
<textarea
  rows={4}
  className="...resize-none"
/>
```
- Sin resize (limpio)
- 4 filas de altura
- Mismo border underline

#### **Submit Button**
```jsx
<motion.button
  type="submit"
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-salon-dark text-white text-sm tracking-[0.2em] uppercase font-body hover:bg-salon-accent"
>
  Request Appointment
  <ArrowUpRight size={16} />
</motion.button>
```

**Interacciones:**
- Hover: Scale 1.02 (crecimiento sutil)
- Tap: Scale 0.98 (feedback táctil)
- Color change: negro → marrón acento
- Full width
- Icono arrow a la derecha

#### **Toast Notifications**
```jsx
import { toast } from "sonner";

toast.error("Please fill in all required fields");
toast.success("Booking request sent! We'll be in touch shortly.");
```
- Librería: Sonner
- Estados: error, success
- Diseño: no visible en código (manejado por librería)

---

### 8. MARQUEE STRIP (Texto Infinito)

#### **Diseño**
```
MAISON • Hair & Nails Atelier • MAISON • Hair & Nails Atelier • ...
```

#### **Implementación**
```jsx
<motion.div
  className="flex whitespace-nowrap"
  animate={{ x: ["-50%", "0%"] }}
  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
>
  {Array(6).fill(null).map((_, i) => (
    <div className="flex items-center gap-8 md:gap-12 mx-8 md:mx-12">
      <span className="text-3xl md:text-5xl font-display text-white/90 tracking-[0.15em]">
        {text}
      </span>
      <span className="w-2 h-2 rounded-full bg-salon-accent/60" />
      <span className="text-lg md:text-xl font-body text-white/40 tracking-wider">
        {accent}
      </span>
      <span className="w-2 h-2 rounded-full bg-[#fad24b]/60" />
    </div>
  ))}
</motion.div>
```

**Características:**
- **Animación:** Loop infinito de -50% a 0% en x-axis
- **Duración:** 20 segundos (lento y fluido)
- **Easing:** Linear (sin aceleración)
- **Separadores:** Puntos circulares entre textos
- **Colores alternados:** Accent marrón y gold
- **Contraste tipográfico:** Display grande + body pequeña

**Fondo:**
```jsx
className="bg-salon-dark py-6 md:py-8 border-y border-white/10"
```
- Fondo oscuro
- Borders superior e inferior sutiles

---

### 9. FOOTER (Completo Multi-columna)

#### **Layout**
```
┌──────────────────────────────────────────────────────┐
│ [BRAND]    [NAVIGATE]    [HOURS]    [CONTACT]       │
│ MAISON     About         Mon-Fri    +1 (555)        │
│ Tagline    Services      9-7pm      hello@...       │
│ ───        Gallery       Sat        Address         │
│            Testimonials  9-5pm                       │
│            Booking       Sun                         │
│                          Closed     [SOCIAL]        │
│                                                      │
│ ─────────────────────────────────────────────────── │
│                                                      │
│ © 2025 MAISON      [Privacy] [Terms]                │
│                                                      │
│           M A I S O N  (watermark)                  │
└──────────────────────────────────────────────────────┘
```

#### **Grid de 4 Columnas**
```jsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16"
```

#### **Brand Column**
```jsx
<h3 className="font-display text-2xl tracking-[0.15em] text-white mb-4">
  MAISON
</h3>
<p className="text-salon-subtle-dark font-body text-sm leading-relaxed">
  {salonData.tagline}
</p>
<div className="mt-6 w-12 h-px bg-salon-accent/40" />
```
- Logo en display font
- Tagline descriptivo
- Línea decorativa de 48px

#### **Navigation Links**
```jsx
<a className="block text-sm text-salon-subtle-dark font-body tracking-wider hover:text-white transition-colors duration-300">
  {item.label}
</a>
```
- Block display (apilados verticalmente)
- Hover: color change sutil
- Espaciado vertical: `space-y-3` (12px)

#### **Hours Display**
```jsx
{salonData.contact.hours.map((h) => (
  <div className="flex flex-col">
    <span className="text-sm text-white/80 font-body tracking-wider">
      {h.day}      {/* Monday-Friday */}
    </span>
    <span className="text-xs text-salon-subtle-dark font-body tracking-wider">
      {h.time}     {/* 9AM - 7PM */}
    </span>
  </div>
))}
```
- Layout vertical por día
- Tipografía diferenciada (día vs horario)

#### **Social Links**
```jsx
<a className="text-xs text-salon-subtle-dark font-body tracking-wider hover:text-white transition-colors duration-300 flex items-center gap-1">
  {s.platform}
  <ArrowUpRight size={10} />
</a>
```
- Micro-iconos arrow
- Inline con texto
- Size reducido (10px)

#### **Large Watermark Text**
```jsx
<span className="block text-[8vw] md:text-[6vw] font-display text-white/5 tracking-[0.1em] leading-none">
  MAISON
</span>
```
- Viewport-based sizing
- Opacity muy baja (5%)
- Propósito: textura de marca, depth visual

---

## 🎬 ANIMACIONES Y TRANSICIONES

### Librería Principal: **Framer Motion**

#### **Tipos de Animación Usados**

### 1. **Fade In + Slide Up** (Patrón más común)

```jsx
<motion.div
  initial={{ opacity: 0, y: 40 }}
  animate={isInView ? { opacity: 1, y: 0 } : {}}
  transition={{ duration: 0.8, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
>
```

**Uso:** Títulos, cards, secciones
**Easing:** Custom cubic-bezier `[0.4, 0, 0.2, 1]` (ease-in-out suave)
**Duración:** 0.6s - 0.8s (variado según complejidad)

### 2. **Stagger Children** (Animación secuencial)

```jsx
{items.map((item, index) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, delay: index * 0.08 }}
  >
```

**Delay formula:** `index * 0.08` (80ms entre elementos)
**Uso:** Service tiles, gallery items, testimonials, navegación móvil
**Efecto:** Cascada visual elegante

### 3. **Letter-by-Letter Split** (Hero Title)

```jsx
{nameLetters.map((letter, i) => (
  <motion.span
    initial={{ y: 200, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{
      duration: 1,
      delay: 0.2 + i * 0.08,
      ease: [0.5, 0, 0.05, 1]    // Easing dramático
    }}
  >
```

**Características:**
- Distancia: 200px (dramática)
- Delay stagger: 80ms por letra
- Easing: Bezier con acceleración agresiva
- Requiere: `display: inline-block` en spans

### 4. **Scale Animations** (Líneas, borders)

```jsx
// Horizontal scale
initial={{ scaleX: 0 }}
animate={{ scaleX: 1 }}
transition={{ duration: 0.8, ease: [0.5, 0, 0.05, 1] }}

// Vertical scale
initial={{ scaleY: 0 }}
animate={{ scaleY: 1 }}
```

**Uso:** Grid lines, decorative lines, hover borders
**Origin:** Por defecto center, puede customizarse con `transformOrigin`

### 5. **Infinite Loop Animations**

**Marquee:**
```jsx
animate={{ x: ["-50%", "0%"] }}
transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
```

**Bounce (Scroll indicator):**
```jsx
animate={{ y: [0, 8, 0] }}
transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
```

### 6. **Hover Animations**

**Button Scale:**
```jsx
whileHover={{ scale: 1.02 }}
whileTap={{ scale: 0.98 }}
```

**Image Zoom:**
```jsx
<motion.img
  whileHover={{ scale: 1.05 }}
  transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
/>
```

**Icon Rotate:**
```jsx
<motion.div animate={{ rotate: isHovered ? 45 : 0 }}>
  <ArrowUpRight />
</motion.div>
```

### 7. **Layout Animations** (Gallery Filter)

```jsx
<motion.div
  layout
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: 30 }}
  transition={{ duration: 0.6, delay: index * 0.08 }}
>
```

**Layout prop:** Anima automáticamente cambios de posición/tamaño
**Uso:** Grids filtradas, reordenamiento de elementos

### 8. **Scroll-Triggered Animations**

**Hook: useInView (Framer Motion)**
```jsx
const ref = useRef(null);
const isInView = useInView(ref, { once: true, margin: "-100px" });

<motion.div
  ref={ref}
  initial={{ opacity: 0, y: 30 }}
  animate={isInView ? { opacity: 1, y: 0 } : {}}
>
```

**Configuración:**
- `once: true` - Anima solo una vez
- `margin: "-100px"` - Trigger 100px antes de que entre en viewport
- **Uso:** TODAS las secciones principales

---

### Custom Easings Usados

#### **Dramatic Ease (Hero, líneas)**
```javascript
ease: [0.5, 0, 0.05, 1]
```
- Aceleración lenta
- Desaceleración muy rápida
- Efecto: Movimiento cinematográfico

#### **Smooth Ease (General)**
```javascript
ease: [0.4, 0, 0.2, 1]
```
- Equivalente a "ease-in-out" mejorado
- Uso más común en el proyecto

#### **Linear (Marquee)**
```javascript
ease: "linear"
```
- Sin aceleración
- Velocidad constante

---

### Transiciones CSS (No Framer Motion)

#### **Color Transitions**
```jsx
className="transition-colors duration-300"
```
**Uso:** Links, buttons, borders
**Duración:** 300ms (estándar)

#### **All Transitions**
```jsx
className="transition-all duration-500"
```
**Uso:** Overlays, complex hover states
**Duración:** 500ms (más lenta para múltiples propiedades)

#### **Backdrop Transition**
```jsx
className="transition-colors duration-500"
```
**Uso:** Header background change en scroll

---

## ✨ EFECTOS VISUALES

### 1. **Grain Texture Overlay**

```css
.grain-overlay::before {
  content: '';
  position: fixed;
  top: -50%;
  left: -50%;
  right: -50%;
  bottom: -50%;
  width: 200%;
  height: 200%;
  background-image: url("data:image/svg+xml,...");
  pointer-events: none;
  z-index: 9998;
  opacity: 0.4;
}
```

**Características:**
- **Tipo:** SVG inline con feTurbulence (fractal noise)
- **Tamaño:** 200% del viewport (evita bordes)
- **Z-index alto:** 9998 (sobre todo menos UI crítica)
- **Pointer-events none:** No interfiere con interacciones
- **Opacidad final:** 0.4 (sutil pero presente)
- **Efecto:** Textura fotográfica/película análoga

**Propósito:** Agrega profundidad orgánica, rompe lo digital

### 2. **Backdrop Blur (Glassmorphism)**

```jsx
className="bg-[#f7f5f2]/90 backdrop-blur-xl"
```

**Uso:** Header en scroll
**Valores:**
- Background: 90% opacidad (semi-transparente)
- Blur: `xl` = 24px
**Compatibilidad:** Modern browsers (Safari, Chrome, Firefox)

### 3. **Custom Scrollbar**

```css
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f7f5f2;  /* Salon cream */
}

::-webkit-scrollbar-thumb {
  background: #61525a;  /* Salon accent */
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #4a3d44;  /* Darker */
}
```

**Diseño:**
- Ancho delgado: 6px (elegante)
- Colores de marca
- Bordes redondeados sutiles
- Hover state oscurecido

### 4. **Selection Color**

```css
::selection {
  background-color: #61525a;  /* Salon accent */
  color: #f7f5f2;             /* Salon cream */
}
```

**Brand consistency:** Hasta la selección de texto usa la paleta

### 5. **Link Underline Animation**

```css
.link-underline::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background-color: currentColor;
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.link-underline:hover::after {
  width: 100%;
}
```

**Efecto:** Underline que crece desde izquierda en hover
**Uso:** Links de navegación, footer links

### 6. **Image Reveal (Clip Path)**

```css
.image-reveal {
  clip-path: inset(100% 0 0 0);
  animation: imageReveal 1s cubic-bezier(0.5, 0, 0.05, 1) forwards;
}

@keyframes imageReveal {
  to {
    clip-path: inset(0 0 0 0);
  }
}
```

**Efecto:** Cortina vertical que revela imagen desde arriba
**Uso:** Imágenes del about section
**Duración:** 1s con easing dramático

### 7. **Gradient Overlays**

```jsx
{/* Sobre imágenes */}
<div className="absolute inset-0 bg-salon-dark/20" />

{/* Hover states */}
<div className="absolute inset-0 bg-salon-dark/0 group-hover:bg-salon-dark/40 transition-all duration-500" />
```

**Valores comunes:**
- 0%: Transparente (inicial)
- 20%: Overlay muy sutil (permanente)
- 40%: Overlay hover (interacción)
- 90%: Semi-opaco (modales, menú móvil backdrop)

### 8. **Box Shadows**

**Header Scrolled:**
```jsx
className="shadow-sm"
```
- Tailwind: `0 1px 2px 0 rgb(0 0 0 / 0.05)`
- Sombra muy sutil, solo para separación visual

**Nota:** No se usan sombras fuertes en el diseño (flat/minimal aesthetic)

---

## 📱 RESPONSIVE DESIGN

### Breakpoints Tailwind

```javascript
// Default Tailwind breakpoints
sm: '640px'
md: '768px'
lg: '1024px'
xl: '1280px'
2xl: '1536px'
```

### Patrones Responsive Comunes

#### **1. Texto Fluido (Clamp)**

```css
/* Hero Title */
font-size: clamp(4rem, 12vw, 14rem);  /* 64px → variable → 224px */

/* Mobile override */
@media (max-width: 768px) {
  font-size: clamp(3rem, 15vw, 6rem); /* 48px → variable → 96px */
}
```

**Ventaja:** Escalado automático sin media queries adicionales

#### **2. Layout Grid Responsive**

```jsx
{/* Mobile → Tablet → Desktop */}
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"

{/* Con sub-breakpoints */}
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
```

**Patrón común:**
- Mobile: 1 columna (stack)
- Tablet: 2 columnas
- Desktop: 3-4 columnas

#### **3. Padding Escalonado**

```jsx
className="px-6 md:px-12"     /* H: 24px → 48px */
className="py-20 md:py-32"    /* V: 80px → 128px */
className="p-8 md:p-10"       /* All: 32px → 40px */
```

#### **4. Gap Responsive**

```jsx
className="gap-4 md:gap-6"      /* 16px → 24px */
className="gap-8 md:gap-12"     /* 32px → 48px */
className="gap-16 md:gap-24"    /* 64px → 96px */
```

#### **5. Tipografía Escalonada**

```jsx
className="text-xs"              /* 12px (fixed) */
className="text-sm"              /* 14px (fixed) */
className="text-base md:text-lg" /* 16px → 18px */
className="text-xl md:text-2xl"  /* 20px → 24px */
className="text-4xl md:text-5xl lg:text-6xl" /* 36px → 48px → 60px */
```

#### **6. Visibilidad Condicional**

```jsx
className="hidden md:block"          /* Oculto en mobile */
className="hidden md:inline-block"   /* Inline en desktop */
className="hidden lg:flex"           /* Flex solo en large */
className="md:hidden"                /* Solo mobile */
```

**Uso común:**
- Menu hamburger: `className="lg:hidden"`
- Nav desktop: `className="hidden lg:flex"`
- Elementos decorativos: `hidden md:block`

#### **7. Flex Direction Change**

```jsx
className="flex flex-col md:flex-row"
```
**Mobile:** Stack vertical
**Desktop:** Horizontal

#### **8. Aspect Ratios Dinámicos**

```jsx
className="aspect-[3/4] md:aspect-auto md:h-full"
```
**Mobile:** Ratio fijo
**Desktop:** Altura natural

---

### Mobile-First Considerations

#### **Touch Targets**
- Botones: mínimo 44px de altura (`py-2.5` = 10px * 2 + text)
- Icons: mínimo 24px (touch-friendly)
- Spacing entre elementos interactivos: mínimo 8px

#### **Typography Hierarchy**
Mobile usa tamaños más pequeños pero mantiene jerarquía:
- Hero: 48-96px (vs 64-224px desktop)
- Headers: 36px (vs 60px desktop)
- Body: 16px (igual en ambos)

#### **Navigation**
- Mobile: Hamburger menu fullscreen
- Desktop (lg+): Horizontal nav inline

#### **Forms**
- Full-width en mobile
- Input padding increase en mobile para touch

---

## 🛠️ LIBRERÍAS Y STACK TECNOLÓGICO

### Core Framework

#### **React** (JSX Components)
```javascript
import { useState, useEffect, useRef } from "react";
```
**Hooks usados:**
- `useState`: Estado local (menu, hover, form data)
- `useEffect`: Scroll listeners, timers
- `useRef`: Referencias a DOM para animaciones

### Animación

#### **Framer Motion** (Animation Library)
```javascript
import { motion, AnimatePresence, useInView } from "framer-motion";
```

**Componentes usados:**
- `<motion.div>`: Cualquier elemento animado
- `<motion.img>`: Imágenes con zoom/scale
- `<motion.button>`: Botones con whileHover/Tap
- `<AnimatePresence>`: Para elementos que entran/salen (mobile menu)

**Hooks:**
- `useInView`: Detección de scroll viewport con opciones
  ```javascript
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  ```

**Props principales:**
- `initial`: Estado inicial
- `animate`: Estado final
- `exit`: Estado al desmontar
- `transition`: Configuración de timing
- `whileHover`: Estado en hover
- `whileTap`: Estado en click
- `layout`: Auto-animación de cambios de layout

### Estilos

#### **Tailwind CSS** (Utility-First CSS)
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: { extend: { ... } },
  plugins: [require("tailwindcss-animate")],
};
```

**Plugin adicional:**
- `tailwindcss-animate`: Animaciones pre-built (accordion, etc.)

**Customización:**
- Colores de marca (`salon-*`)
- Fonts custom
- Border radius variables
- Keyframes adicionales

#### **CSS Puro** (App.css)
```css
/* Casos especiales no cubiertos por Tailwind */
- .hero-title (clamp font-size)
- .grain-overlay (texture)
- Scrollbar styling
- Selection color
- Link underline animations
```

### Iconos

#### **Lucide React** (Icon Components)
```javascript
import { Menu, X, ArrowUpRight, ArrowDown, Star } from "lucide-react";
```

**Ventajas:**
- Tree-shakeable (solo importas los que usas)
- SVG components
- Props: size, color, className
- Consistencia visual

**Iconos usados:**
- `Menu` / `X`: Hamburger menu toggle
- `ArrowUpRight`: CTAs, links externos
- `ArrowDown`: Scroll indicator
- `Star`: Ratings (con fill)

### Notifications

#### **Sonner** (Toast Notifications)
```javascript
import { toast } from "sonner";

toast.success("Message");
toast.error("Error message");
```

**Características:**
- Minimalista
- Auto-dismiss
- Stack automático
- Accesible (ARIA)

### Tipografía

#### **Google Fonts**
```html
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&display=swap" rel="stylesheet" />
```

**Loading strategy:**
- Preconnect para performance
- `display=swap` para evitar FOIT (Flash of Invisible Text)

---

## 🎯 PATRONES DE DISEÑO

### 1. **Editorial Layout**

**Características:**
- Espacios en blanco generosos
- Tipografía como foco principal
- Grid subyacente visible
- Asimetría controlada

**Inspiración:** Revistas de moda, portfolios de agencias premium

### 2. **Scroll-Reveal Pattern**

```javascript
const ref = useRef(null);
const isInView = useInView(ref, { once: true, margin: "-100px" });

<motion.div
  ref={ref}
  initial={{ opacity: 0, y: 30 }}
  animate={isInView ? { opacity: 1, y: 0 } : {}}
>
```

**Implementado en:** TODAS las secciones
**Propósito:** Narrativa visual progresiva

### 3. **Stagger Children / Cascade**

```javascript
{items.map((item, index) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.08 }}
  >
))}
```

**Uso:**
- Service tiles (4 simultáneos con delay)
- Gallery items (masonry reveal)
- Navigation móvil (efecto cascada dramático)

### 4. **Hover-Reveal Pattern**

```javascript
const [isHovered, setIsHovered] = useState(false);

<motion.div
  onMouseEnter={() => setIsHovered(true)}
  onMouseLeave={() => setIsHovered(false)}
>
  <motion.p animate={{ opacity: isHovered ? 1 : 0 }}>
    {description}
  </motion.p>
</motion.div>
```

**Uso:** Service tiles, gallery cards
**Filosofía:** "Progressive disclosure" - información en capas

### 5. **Micro-Interactions**

#### **Button Feedback:**
```jsx
whileHover={{ scale: 1.02 }}
whileTap={{ scale: 0.98 }}
```

#### **Icon Rotation:**
```jsx
animate={{ rotate: isHovered ? 45 : 0 }}
```

#### **Border Growth:**
```jsx
animate={{ scaleX: isHovered ? 1 : 0 }}
```

**Propósito:** Feedback táctil, affordance visual

### 6. **Color Blocking (Swiss/Bento Box)**

```
┌────────┬────────┬────────┬────────┐
│ #e8d5c4│ #d4c5b9│ #f2e6d9│ #c9b8a8│
└────────┴────────┴────────┴────────┘
```

**Características:**
- Cada tile color único
- Grid sin gaps
- Contenido sobre color plano
- Imagen en hover (reveal)

**Inspiración:** Daniel Burka (DB Brand), Swiss design

### 7. **Floating Elements**

**Accent Badge (About Section):**
```jsx
className="absolute -bottom-8 -left-8 bg-[#fad24b]"
```

**Características:**
- Posición absoluta
- Overflow del contenedor padre
- Color contrastante (amarillo gold)
- Sin border-radius

**Propósito:** Romper la grid, agregar dinamismo

### 8. **Decorative Grid Lines**

```jsx
{/* Blueprint/Wireframe effect */}
{[25, 50, 75].map(pos => (
  <motion.div
    className="absolute w-px h-full bg-salon-accent/20"
    style={{ left: `${pos}%` }}
    initial={{ scaleY: 0 }}
    animate={{ scaleY: 1 }}
  />
))}
```

**Propósito:**
- Estructura visual implícita
- Guía de lectura
- Minimalismo sofisticado

### 9. **Dark/Light Section Alternation**

```
LIGHT (cream) → DARK → LIGHT → DARK → LIGHT → DARK
Hero           About   Services  Testimonials  Booking  Footer
```

**Ventajas:**
- Separación visual clara
- Ritmo visual
- Contraste dramático

### 10. **Mobile-First Component Architecture**

```jsx
{/* Mobile */}
<button className="lg:hidden">
  <Menu />
</button>

{/* Desktop */}
<nav className="hidden lg:flex">
  {items.map(...)}
</nav>
```

**Filosofía:** Diseño responsive como prioridad, no afterthought

---

## 🔍 WIREFRAME CONCEPTUAL

### Estructura de Página

```
┌─────────────────────────────────────┐
│ HEADER (Fixed)                      │ ← Transparente → Glassmorphism
├─────────────────────────────────────┤
│                                     │
│            HERO                     │ ← Grid lines + Super title
│         M A I S O N                 │ ← Animated letters
│                                     │
├─────────────────────────────────────┤
│         ABOUT (Dark)                │ ← Two columns + floating badge
│  [Text]           [Image + 7+]      │
│  Stats ─────────────────────        │
├─────────────────────────────────────┤
│       SERVICES GRID (Light)         │ ← 4-column Bento Box
│  [T][T][T][T]                       │ ← Color tiles with hover
├─────────────────────────────────────┤
│      MARQUEE STRIP (Dark)           │ ← Infinite scroll text
│  MAISON • Atelier • MAISON • ...    │
├─────────────────────────────────────┤
│       GALLERY (Light)               │ ← Masonry + Filters
│  [Filters: All | Hair | Nails]      │
│  [IMG][IMG]    [IMG]                │
│  [IMG]    [IMG][IMG]                │
├─────────────────────────────────────┤
│     TESTIMONIALS (Dark)             │ ← 3-column cards
│  [Card][Card][Card]                 │ ← Stars + quote + avatar
├─────────────────────────────────────┤
│       BOOKING (Light)               │ ← Two columns
│  [CTA Text]     [Form]              │
├─────────────────────────────────────┤
│        FOOTER (Dark)                │ ← 4-column + watermark
│  [Brand][Nav][Hours][Contact]       │
│  ─────────────────────────          │
│  © 2025              [Links]        │
│         M A I S O N (watermark)     │
└─────────────────────────────────────┘
```

---

## 📊 MÉTRICAS DE DISEÑO

### Timing

#### **Animaciones Rápidas** (0.3s)
- Hover states
- Color changes
- Pequeñas transformaciones

#### **Animaciones Medias** (0.6-0.8s)
- Fade ins
- Slides
- Mayoría de transiciones

#### **Animaciones Lentas** (1-1.2s)
- Hero title letters
- Grid line reveals
- Imágenes grandes

#### **Animaciones Muy Lentas** (20s)
- Marquee loop

### Espaciado

#### **Micro** (0-16px)
- gap-1: 4px
- gap-2: 8px
- gap-3: 12px
- gap-4: 16px

#### **Standard** (24-48px)
- gap-6: 24px (common)
- gap-8: 32px
- gap-12: 48px (common)

#### **Macro** (64-128px)
- gap-16: 64px
- gap-24: 96px
- py-20: 80px (section padding)
- py-32: 128px (section padding)

### Opacidades Comunes

- 5%: Watermark text
- 10%: Borders sutiles
- 20%: Grid lines, overlays permanentes
- 40%: Placeholder text, overlays hover
- 60%: Elementos secundarios
- 80%: Texto cuerpo sobre fondos oscuros
- 90%: Header background

---

## 🎓 PRINCIPIOS DE DISEÑO APLICADOS

### 1. **Elegancia a través de la Restricción**

**Paleta limitada:**
- 3 colores principales
- 2 acentos
- Opacidades para variaciones

**Tipografías:**
- Solo 2 familias
- Contraste dramático (Serif display + Sans body)

### 2. **Jerarquía Clara**

**Visual:**
- Tamaños de tipo escalonados y consistentes
- Color para estados y énfasis
- Espaciado generoso para separación

**Animación:**
- Elementos importantes = animaciones más lentas
- Secundarios = rápidos
- Stagger para guiar la mirada

### 3. **Performance-Minded**

**Animaciones:**
- Transform y opacity (GPU-accelerated)
- Evita animaciones de width/height directas
- Use scale para cambios de tamaño

**Imágenes:**
- Unsplash con parámetros de optimización (`w=800&q=80`)
- Aspect ratios fijos para evitar layout shift

### 4. **Accesibilidad**

**Contraste:**
- Negro sobre crema: ratio alto
- Blanco sobre negro: ratio alto
- Text mínimo: 12px (labels)

**Touch Targets:**
- Botones mínimo 44px altura
- Espaciado entre elementos

**Focus States:**
- `focus:border-salon-accent` en inputs
- `focus:outline-none` solo cuando hay alternativa visual

### 5. **Progressive Enhancement**

**Mobile First:**
- Layout base = 1 columna
- Breakpoints agregan complejidad

**Animation Fallbacks:**
- Funcional sin JS
- Animaciones mejoran, no son críticas

---

## 🚀 CÓMO RECREAR ESTE ESTILO

### Checklist Esencial

#### **Setup Inicial**
- [ ] Instalar React + Framer Motion + Tailwind
- [ ] Configurar 2 fuentes (1 serif display + 1 sans body)
- [ ] Definir paleta de 5 colores máximo
- [ ] Extender Tailwind con colores custom

#### **Estructura**
- [ ] Header fixed con glassmorphism en scroll
- [ ] Secciones alternas dark/light
- [ ] Padding consistente (px-6 md:px-12, py-20 md:py-32)

#### **Tipografía**
- [ ] Hero title con clamp() y tracking ancho
- [ ] Labels en uppercase con tracking 20-30%
- [ ] Line-height compacto en headlines (0.9-1.1)
- [ ] Line-height generoso en body (1.5-1.625)

#### **Animaciones**
- [ ] useInView en TODAS las secciones
- [ ] Stagger en listas/grids (delay: index * 0.08)
- [ ] Custom easing: [0.4, 0, 0.2, 1]
- [ ] Hover states con whileHover

#### **Componentes Clave**
- [ ] Cards con hover-reveal content
- [ ] Bento box grid con colores únicos
- [ ] Forms con border-bottom style
- [ ] Marquee infinito

#### **Detalles**
- [ ] Grain texture overlay
- [ ] Decorative grid lines
- [ ] Floating accent elements
- [ ] Custom scrollbar
- [ ] Selection color

---

## 📚 RECURSOS Y REFERENCIAS

### Inspiración de Diseño
- **Awwwards** - Sitios premiados
- **Behance** - Portfolios de alta gama
- **Dribbble** - UI/UX shots
- **Swiss Design** - Minimalismo estructural
- **Editorial Design** - Revistas de moda/arquitectura

### Herramientas
- **Framer Motion Docs** - https://www.framer.com/motion/
- **Tailwind CSS** - https://tailwindcss.com
- **Lucide Icons** - https://lucide.dev
- **Google Fonts** - https://fonts.google.com

### Conceptos Clave
- **Glassmorphism**: backdrop-blur effects
- **Micro-interactions**: Subtle hover states
- **Kinetic Typography**: Animated text
- **Bento Box Layout**: Color-blocked grids
- **Scroll-triggered Animations**: Progressive reveal

---

## 🎬 CONCLUSIÓN

Este diseño representa un **approach premium de alta gama** que combina:

✅ **Minimalismo sofisticado** (espacios en blanco, paleta restringida)
✅ **Tipografía cinematográfica** (tamaños dramáticos, animaciones letra por letra)
✅ **Animaciones fluidas** (Framer Motion con custom easing)
✅ **Micro-interacciones** (feedback en cada elemento)
✅ **Sistema de diseño coherente** (componentes reutilizables)
✅ **Responsive impecable** (mobile-first approach)

**Ideal para:**
- Marcas de lujo/premium
- Portfolios creativos
- Agencias de diseño
- E-commerce boutique
- Sitios editoriales

**Tiempo de desarrollo estimado:**
- Setup + componentes base: 20-30 horas
- Animaciones + pulido: 15-20 horas
- Responsive + testing: 10-15 horas
- **Total:** 45-65 horas (1-2 semanas para un dev experimentado)

**Nivel de dificultad:**
- React: Intermedio
- Framer Motion: Intermedio-Avanzado
- Tailwind: Intermedio
- CSS: Intermedio

---

*Documentación creada por análisis exhaustivo del proyecto MAISON*
*Fecha: 2026*
