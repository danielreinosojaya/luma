"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  MenuItem,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";
import { ArrowRight, Check, Sparkles, Star, Users, WandSparkles, X, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Glass } from "@/components/ui/glass";
import { Input } from "@/components/ui/input";

// ============================================================================
// Premium Scroll Microinteractions Hooks
// ============================================================================

const useParallax = (ref: React.RefObject<HTMLDivElement | null>, speed: number = 0.5) => {
  useEffect(() => {
    if (!ref.current) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (ref.current) {
        ref.current.style.transform = `translateY(${scrollY * speed}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [ref, speed]);
};

const useRevealOnScroll = (ref: React.RefObject<HTMLElement | null>, className: string = "animate-reveal") => {
  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(className);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -100px 0px" }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, className]);
};

const useRevealChildren = (
  ref: React.RefObject<HTMLElement | null>,
  className: string = "animate-reveal",
  selector: string = "> *"
) => {
  useEffect(() => {
    if (!ref.current) return;

    const elements = ref.current.querySelectorAll(selector);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          elements.forEach((el, idx) => {
            setTimeout(() => {
              el.classList.add(className);
              const delay = Math.min(idx * 80, 400);
              (el as HTMLElement).style.animationDelay = `${delay}ms`;
            }, 0);
          });
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -80px 0px" }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, className, selector]);
};

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

type AuthPayload = {
  user: {
    id: string;
    name: string | null;
    email: string;
    role: "ADMIN" | "STAFF" | "CLIENT";
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
  };
};

type Service = {
  id: string;
  name: string;
  description?: string | null;
  category: "HAIR" | "NAILS" | "BROWS" | "LASHES";
  durationMin: number;
  price: number;
  active: boolean;
};

type RawCombo = {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  discountPct: number;
  services: Array<{ service: Service }>;
};

type Combo = {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  discount: number;
  services: Service[];
};

type RawStaff = {
  id: string;
  role: string;
  user: {
    name: string | null;
    email: string;
  };
  services: Array<{ service: Service }>;
};

type StaffMember = {
  id: string;
  name: string;
  role: string;
  specialties: string[];
};

type Slot = {
  startAt: string;
  endAt: string;
};

const categoryLabel: Record<Service["category"], string> = {
  HAIR: "Hair",
  NAILS: "Nails",
  BROWS: "Brows",
  LASHES: "Lashes",
};

export default function Page() {
  // Parallax & Reveal Refs
  const parallaxBgRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLElement>(null);
  const servicesSectionRef = useRef<HTMLElement>(null);
  const combosSectionRef = useRef<HTMLElement>(null);
  const staffSectionRef = useRef<HTMLElement>(null);

  // Auth & Booking State
  const [authTab, setAuthTab] = useState(0);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  const [token, setToken] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<AuthPayload["user"] | null>(null);

  const [services, setServices] = useState<Service[]>([]);
  const [combos, setCombos] = useState<Combo[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);

  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedComboId, setSelectedComboId] = useState<string | null>(null);
  const [selectedStaffId, setSelectedStaffId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState("");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [slotsLoading, setSlotsLoading] = useState(false);

  const [signinForm, setSigninForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [bookingForm, setBookingForm] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    notes: "",
  });

  const selectedServicesData = useMemo(
    () => services.filter((service) => selectedServices.includes(service.id)),
    [services, selectedServices]
  );

  const totalPrice = useMemo(
    () => selectedServicesData.reduce((sum, item) => sum + item.price, 0),
    [selectedServicesData]
  );

  const authenticatedFetch = useCallback(
    async (url: string, options: RequestInit = {}) => {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(options.headers ?? {}),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      return response;
    },
    [token]
  );

  const resetBookingState = () => {
    setSelectedServices([]);
    setSelectedComboId(null);
    setSelectedStaffId("");
    setSelectedDate("");
    setSlots([]);
    setSelectedSlot(null);
    setBookingForm({ clientName: "", clientEmail: "", clientPhone: "", notes: "" });
    setBookingError(null);
    setBookingSuccess(null);
  };

  const loadCatalog = useCallback(async () => {
    if (!token) return;

    try {
      const [servicesRes, combosRes, staffRes] = await Promise.all([
        authenticatedFetch("/api/v1/services"),
        authenticatedFetch("/api/v1/combos"),
        authenticatedFetch("/api/v1/staff"),
      ]);

      const servicesJson = (await servicesRes.json()) as ApiResponse<Service[]>;
      const combosJson = (await combosRes.json()) as ApiResponse<RawCombo[]>;
      const staffJson = (await staffRes.json()) as ApiResponse<RawStaff[]>;

      if (servicesJson.success && servicesJson.data) {
        setServices(servicesJson.data);
      }

      if (combosJson.success && combosJson.data) {
        setCombos(
          combosJson.data.map((combo) => ({
            id: combo.id,
            name: combo.name,
            description: combo.description,
            price: combo.price,
            discount: combo.discountPct,
            services: combo.services.map((item) => item.service),
          }))
        );
      }

      if (staffJson.success && staffJson.data) {
        setStaff(
          staffJson.data.map((member) => ({
            id: member.id,
            name: member.user.name ?? "Especialista",
            role: member.role,
            specialties: member.services.slice(0, 3).map((item) => item.service.name),
          }))
        );
      }
    } catch {
      setServices([]);
      setCombos([]);
      setStaff([]);
    }
  }, [authenticatedFetch, token]);

  useEffect(() => {
    const storedToken = localStorage.getItem("luma.accessToken");
    const storedUser = localStorage.getItem("luma.user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser) as AuthPayload["user"]);
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn && token) {
      loadCatalog();
    }
  }, [isLoggedIn, token, loadCatalog]);

  // Premium scroll microinteractions
  useParallax(parallaxBgRef, 0.35);
  useRevealOnScroll(heroSectionRef, "animate-reveal");
  useRevealChildren(servicesSectionRef, "animate-reveal", "[data-reveal]");
  useRevealChildren(combosSectionRef, "animate-reveal", "[data-reveal]");
  useRevealChildren(staffSectionRef, "animate-reveal", "[data-reveal]");

  const handleSignin = async () => {
    setAuthLoading(true);
    setAuthError(null);

    // Validaciones cliente
    if (!signinForm.email || !signinForm.email.trim()) {
      setAuthError("El email es requerido");
      setAuthLoading(false);
      return;
    }

    if (!signinForm.password || !signinForm.password.trim()) {
      setAuthError("La contraseña es requerida");
      setAuthLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/v1/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: signinForm.email.trim().toLowerCase(),
          password: signinForm.password,
        }),
      });

      const json = (await response.json()) as ApiResponse<AuthPayload>;
      if (!response.ok || !json.success || !json.data) {
        throw new Error(json.error || "No se pudo iniciar sesión");
      }

      setToken(json.data.tokens.accessToken);
      setUser(json.data.user);
      setIsLoggedIn(true);
      localStorage.setItem("luma.accessToken", json.data.tokens.accessToken);
      localStorage.setItem("luma.refreshToken", json.data.tokens.refreshToken);
      localStorage.setItem("luma.user", JSON.stringify(json.data.user));
      setSigninForm({ email: "", password: "" });
      setAuthModalOpen(false);
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Error inesperado");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignup = async () => {
    setAuthLoading(true);
    setAuthError(null);

    // Validaciones cliente
    if (!signupForm.name || !signupForm.name.trim()) {
      setAuthError("El nombre es requerido");
      setAuthLoading(false);
      return;
    }

    if (signupForm.name.includes("@")) {
      setAuthError("El nombre no puede ser un email. Escribe tu nombre y apellido (ej: Juan Pérez)");
      setAuthLoading(false);
      return;
    }

    if (!signupForm.email || !signupForm.email.trim()) {
      setAuthError("El email es requerido");
      setAuthLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signupForm.email)) {
      setAuthError("Ingresa un email válido");
      setAuthLoading(false);
      return;
    }

    if (!signupForm.phone || !signupForm.phone.trim()) {
      setAuthError("El teléfono es requerido");
      setAuthLoading(false);
      return;
    }

    const phoneRegex = /^\+?[0-9\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(signupForm.phone)) {
      setAuthError("Ingresa un teléfono válido (ej: +549 11 1234 5678)");
      setAuthLoading(false);
      return;
    }

    if (!signupForm.password || !signupForm.password.trim()) {
      setAuthError("La contraseña es requerida");
      setAuthLoading(false);
      return;
    }

    if (signupForm.password.length < 6) {
      setAuthError("La contraseña debe tener al menos 6 caracteres");
      setAuthLoading(false);
      return;
    }

    if (!/[A-Z]/.test(signupForm.password)) {
      setAuthError("La contraseña debe contener al menos una letra mayúscula");
      setAuthLoading(false);
      return;
    }

    if (!/[0-9]/.test(signupForm.password)) {
      setAuthError("La contraseña debe contener al menos un número");
      setAuthLoading(false);
      return;
    }

    if (!/[!@#$%^&*()_+=\-\[\]{};':"\\|,.<>\/?]/.test(signupForm.password)) {
      setAuthError("La contraseña debe contener al menos un carácter especial (!@#$%^&*)");
      setAuthLoading(false);
      return;
    }

    if (signupForm.password !== signupForm.confirmPassword) {
      setAuthError("Las contraseñas no coinciden");
      setAuthLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/v1/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signupForm.name.trim(),
          email: signupForm.email.trim().toLowerCase(),
          phone: signupForm.phone.trim(),
          password: signupForm.password,
        }),
      });

      const json = (await response.json()) as ApiResponse<AuthPayload>;
      if (!response.ok || !json.success || !json.data) {
        throw new Error(json.error || "No se pudo crear la cuenta");
      }

      setToken(json.data.tokens.accessToken);
      setUser(json.data.user);
      setIsLoggedIn(true);
      localStorage.setItem("luma.accessToken", json.data.tokens.accessToken);
      localStorage.setItem("luma.refreshToken", json.data.tokens.refreshToken);
      localStorage.setItem("luma.user", JSON.stringify(json.data.user));

      setSignupForm({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
      setAuthModalOpen(false);
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Error inesperado");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setToken(null);
    setUser(null);
    setServices([]);
    setCombos([]);
    setStaff([]);
    resetBookingState();

    localStorage.removeItem("luma.accessToken");
    localStorage.removeItem("luma.refreshToken");
    localStorage.removeItem("luma.user");
  };

  const toggleService = (serviceId: string) => {
    setSelectedComboId(null);
    setSelectedServices((prev) =>
      prev.includes(serviceId) ? prev.filter((item) => item !== serviceId) : [...prev, serviceId]
    );
  };

  const chooseCombo = (comboId: string) => {
    const combo = combos.find((item) => item.id === comboId);
    if (!combo) return;

    setSelectedComboId(comboId);
    setSelectedServices(combo.services.map((service) => service.id));
  };

  const loadAvailability = async () => {
    if (!selectedStaffId || !selectedDate || selectedServices.length === 0) {
      setBookingError("Selecciona profesional, fecha y servicios");
      return;
    }

    setSlotsLoading(true);
    setBookingError(null);
    setSelectedSlot(null);

    try {
      const params = new URLSearchParams({
        staffId: selectedStaffId,
        date: selectedDate,
      });

      selectedServices.forEach((serviceId) => {
        params.append("serviceIds", serviceId);
      });

      const response = await authenticatedFetch(`/api/v1/availability?${params.toString()}`);
      const json = (await response.json()) as ApiResponse<{ slots: Slot[] }>;

      if (!response.ok || !json.success || !json.data) {
        throw new Error(json.error || "No se pudo cargar disponibilidad");
      }

      setSlots(json.data.slots ?? []);
    } catch (error) {
      setSlots([]);
      setBookingError(error instanceof Error ? error.message : "Error inesperado");
    } finally {
      setSlotsLoading(false);
    }
  };

  const submitBooking = async () => {
    if (!selectedSlot) {
      setBookingError("Selecciona un horario");
      return;
    }

    if (!bookingForm.clientName || !bookingForm.clientEmail || !bookingForm.clientPhone) {
      setBookingError("Completa todos los datos de contacto");
      return;
    }

    setBookingLoading(true);
    setBookingError(null);

    try {
      const response = await authenticatedFetch("/api/v1/appointments", {
        method: "POST",
        body: JSON.stringify({
          clientName: bookingForm.clientName,
          clientEmail: bookingForm.clientEmail,
          clientPhone: bookingForm.clientPhone,
          staffId: selectedStaffId,
          serviceIds: selectedServices,
          comboId: selectedComboId || undefined,
          startAt: selectedSlot.startAt,
          notes: bookingForm.notes || undefined,
          idempotencyKey: crypto.randomUUID(),
        }),
      });

      const json = (await response.json()) as ApiResponse<{ id: string }>;
      if (!response.ok || !json.success || !json.data) {
        throw new Error(json.error || "No se pudo reservar");
      }

      setBookingSuccess("Reserva confirmada. Te enviaremos confirmación por email.");
      setTimeout(() => {
        setBookingModalOpen(false);
        resetBookingState();
      }, 1400);
    } catch (error) {
      setBookingError(error instanceof Error ? error.message : "Error inesperado");
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#FAF8F6] text-[#2C2623]">
      <div ref={parallaxBgRef} className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute -left-28 -top-32 h-[24rem] w-[24rem] rounded-full opacity-45 blur-3xl"
          style={{ background: "linear-gradient(135deg, #C4956F 0%, #A89887 100%)" }}
        />
        <div
          className="absolute -right-24 top-1/4 h-[22rem] w-[22rem] rounded-full opacity-35 blur-3xl"
          style={{ background: "linear-gradient(225deg, #8B7765 0%, #6F5F54 100%)" }}
        />
        <div
          className="absolute bottom-[-7rem] left-[36%] h-[20rem] w-[20rem] rounded-full opacity-30 blur-3xl"
          style={{ background: "linear-gradient(20deg, #E8DDD4 0%, #C4956F 100%)" }}
        />
      </div>

      <header className="glass-lg fixed left-0 right-0 top-0 z-40 border-b border-white/30">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#C4956F] to-[#8B7765] shadow-lg">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="font-display text-xl font-semibold text-[#8B7765]">LUMA</span>
          </div>

          <nav className="hidden items-center gap-10 md:flex">
            {[
              { label: "Servicios", href: "#servicios" },
              { label: "Combos", href: "#combos" },
              { label: "Equipo", href: "#equipo" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8B7765]/90 hover:text-[#C4956F]"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {!isLoggedIn ? (
              <>
                <button
                  onClick={() => {
                    setAuthTab(0);
                    setAuthModalOpen(true);
                  }}
                  className="px-2 text-sm font-medium text-[#8B7765] hover:text-[#C4956F]"
                >
                  Ingresar
                </button>
                <Button
                  onClick={() => {
                    setAuthTab(1);
                    setAuthModalOpen(true);
                  }}
                  className="gap-2"
                >
                  Crear cuenta <ArrowRight className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Badge variant="glass" className="hidden sm:flex">
                  {user?.name ?? user?.email}
                </Badge>
                <Button variant="outline" onClick={handleLogout}>
                  Salir
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-7xl px-4 pb-20 pt-28 md:px-8">
        <section ref={heroSectionRef} className="grid grid-cols-1 items-center gap-10 py-16 lg:grid-cols-[1.2fr_0.8fr]">
          <div data-reveal className="space-y-8 animate-slide-in-left">
            <Badge variant="secondary" className="w-fit">Experiencia Beauty de Autor</Badge>
            <h1 className="font-display text-5xl font-semibold leading-[1.05] text-[#8B7765] md:text-7xl">
              Belleza que
              <span className="block -translate-y-1 text-[#C4956F]">se nota</span>
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-[#7F7065] md:text-lg">
              Potenciamos tu imagen con tratamientos premium, asesoría personalizada y especialistas que cuidan cada detalle.
              Reserva en minutos y vive una experiencia cálida, elegante y pensada para ti.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                className="gap-2"
                onClick={() => {
                  if (!isLoggedIn) {
                    setAuthTab(0);
                    setAuthModalOpen(true);
                    return;
                  }
                  setBookingModalOpen(true);
                }}
              >
                Reservar ahora <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={() => window.location.assign("#servicios")}>
                Ver catálogo
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-5">
              {[
                { stat: "15+", label: "Años" },
                { stat: "500+", label: "Clientes" },
                { stat: "50+", label: "Rituales" },
              ].map((item, idx) => (
                <Glass key={item.label} blur="sm" className="p-4 text-center" style={{ animationDelay: `${idx * 90}ms` }}>
                  <p className="font-display text-2xl font-semibold text-[#C4956F]">{item.stat}</p>
                  <p className="text-xs uppercase tracking-wide text-[#8B7765]">{item.label}</p>
                </Glass>
              ))}
            </div>
          </div>

          <div data-reveal className="relative animate-slide-in-right">
            <div className="grid grid-cols-2 gap-4">
              <Glass blur="lg" className="col-span-2 p-7 md:p-9">
                <div className="mb-3 flex items-center gap-2">
                  <Star className="h-5 w-5 text-[#C4956F]" />
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8B7765]">Luma Signature</span>
                </div>
                <h3 className="font-display text-3xl text-[#8B7765]">Rituales personalizados</h3>
                <p className="mt-2 text-sm text-[#7F7065]">
                  Diseñamos cada cita según tu estilo, tipo de piel y objetivo para que salgas segura, radiante y feliz con tu resultado.
                </p>
              </Glass>

              <Glass blur="sm" className="p-5">
                <Zap className="mb-3 h-5 w-5 text-[#C4956F]" />
                <p className="text-sm font-semibold text-[#8B7765]">Reserva rápida</p>
                <p className="text-xs text-[#7F7065]">Tu horario ideal en pocos pasos</p>
              </Glass>

              <Glass blur="sm" className="translate-y-6 p-5">
                <Users className="mb-3 h-5 w-5 text-[#C4956F]" />
                <p className="text-sm font-semibold text-[#8B7765]">Equipo experto</p>
                <p className="text-xs text-[#7F7065]">Profesionales certificadas</p>
              </Glass>
            </div>
          </div>
        </section>

        {isLoggedIn && (
          <>
            <section ref={servicesSectionRef} id="servicios" className="py-14">
              <div className="mb-8 flex items-end justify-between">
                <div>
                  <Badge variant="secondary" className="mb-3">Tratamientos</Badge>
                  <h2 className="font-display text-4xl text-[#8B7765]">Servicios en tendencia</h2>
                </div>
                <WandSparkles className="hidden h-5 w-5 text-[#C4956F] md:block" />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
                {services.map((service, idx) => (
                  <Glass
                    key={service.id}
                    data-reveal
                    blur="md"
                    className={`group p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                      idx % 5 === 0 ? "md:col-span-7" : "md:col-span-5"
                    }`}
                    onClick={() => toggleService(service.id)}
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <Chip
                        label={categoryLabel[service.category]}
                        size="small"
                        sx={{ backgroundColor: "#FFF9F5", color: "#8B7765", border: "1px solid #E8DDD4" }}
                      />
                      {selectedServices.includes(service.id) && (
                        <Badge variant="glass" className="bg-[#C4956F] text-white">
                          <Check className="mr-1 h-3 w-3" /> Elegido
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-display text-2xl text-[#8B7765]">{service.name}</h3>
                    <p className="mt-2 text-sm text-[#7F7065]">{service.description || "Tratamiento premium personalizado."}</p>
                    <div className="mt-5 flex items-center justify-between border-t border-white/20 pt-4">
                      <span className="text-xs uppercase tracking-wide text-[#8B7765]">{service.durationMin} min</span>
                      <span className="font-display text-2xl text-[#C4956F]">${service.price}</span>
                    </div>
                  </Glass>
                ))}
              </div>
            </section>

            <section ref={combosSectionRef} id="combos" className="py-14">
              <div className="mb-8">
                <Badge variant="secondary" className="mb-3">Paquetes</Badge>
                <h2 className="font-display text-4xl text-[#8B7765]">Paquetes con descuento</h2>
              </div>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {combos.map((combo, idx) => (
                  <Glass
                    key={combo.id}
                    data-reveal
                    blur="lg"
                    className={`relative overflow-hidden p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                      idx % 2 === 0 ? "md:translate-y-2" : ""
                    }`}
                    onClick={() => chooseCombo(combo.id)}
                  >
                    <div className="absolute right-5 top-5 rounded-full bg-[#C4956F] px-3 py-1 text-xs font-semibold text-white">
                      -{combo.discount}%
                    </div>
                    <h3 className="font-display text-3xl text-[#8B7765]">{combo.name}</h3>
                    <p className="mt-2 text-sm text-[#7F7065]">{combo.description || "Paquete optimizado para resultados visibles."}</p>
                    <div className="mt-5 space-y-2 border-y border-white/20 py-4">
                      {combo.services.slice(0, 4).map((item) => (
                        <div key={item.id} className="flex items-center gap-2 text-sm text-[#7F7065]">
                          <Check className="h-4 w-4 text-[#C4956F]" />
                          {item.name}
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs uppercase tracking-wide text-[#8B7765]">Precio final</span>
                      <span className="font-display text-3xl text-[#C4956F]">${combo.price}</span>
                    </div>
                    {selectedComboId === combo.id && (
                      <Badge variant="glass" className="mt-4 bg-[#8B7765] text-white">
                        Combo aplicado
                      </Badge>
                    )}
                  </Glass>
                ))}
              </div>
            </section>

            <section ref={staffSectionRef} id="equipo" className="py-14">
              <div className="mb-8">
                <Badge variant="secondary" className="mb-3">Profesionales</Badge>
                <h2 className="font-display text-4xl text-[#8B7765]">Especialistas</h2>
              </div>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                {staff.map((member, idx) => (
                  <Glass
                    key={member.id}
                    data-reveal
                    blur="md"
                    className={`p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                      idx === 1 ? "md:translate-y-6" : ""
                    }`}
                    onClick={() => setSelectedStaffId(member.id)}
                  >
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-[#C4956F] to-[#8B7765] text-xl font-semibold text-white">
                      {member.name[0]}
                    </div>
                    <h3 className="font-display text-2xl text-[#8B7765]">{member.name}</h3>
                    <p className="mt-1 text-xs uppercase tracking-wide text-[#C4956F]">{member.role}</p>
                    <div className="mt-4 flex flex-wrap justify-center gap-2">
                      {member.specialties.slice(0, 2).map((specialty) => (
                        <Badge key={specialty} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                    {selectedStaffId === member.id && (
                      <Badge variant="glass" className="mt-4 bg-[#8B7765] text-white">Seleccionado</Badge>
                    )}
                  </Glass>
                ))}
              </div>
            </section>
          </>
        )}

        <section className="py-16">
          <div
            className="relative overflow-hidden rounded-3xl border border-white/30 p-12 text-white"
            style={{
              background: "linear-gradient(135deg, rgba(139,119,101,0.92) 0%, rgba(111,95,84,0.75) 100%)",
              backdropFilter: "blur(20px)",
            }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">Tu próxima cita comienza aquí</p>
            <h2 className="mt-3 font-display text-4xl">Descubre tu mejor versión</h2>
            <p className="mt-3 max-w-2xl text-white/85">
              Cuidado experto, productos de alta gama y una experiencia premium diseñada para que te sientas increíble desde el primer minuto.
            </p>
            <Button
              className="mt-7 gap-2 bg-[#C4956F] hover:bg-[#B88657]"
              onClick={() => {
                if (!isLoggedIn) {
                  setAuthTab(0);
                  setAuthModalOpen(true);
                  return;
                }
                setBookingModalOpen(true);
              }}
            >
              Reservar mi cita <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </section>
      </main>

      <Dialog
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: "linear-gradient(145deg, rgba(250,248,246,0.97) 0%, rgba(255,249,245,0.96) 100%)",
            backdropFilter: "blur(14px)",
            border: "1px solid rgba(232,221,212,0.55)",
          },
        }}
      >
        <DialogContent className="relative space-y-5 p-6">
          <button
            onClick={() => setAuthModalOpen(false)}
            className="absolute right-4 top-4 rounded-lg p-1 text-[#8B7765] hover:bg-[#F0E8E1]"
          >
            <X className="h-5 w-5" />
          </button>

          <h3 className="font-display text-2xl text-[#8B7765]">Acceso</h3>

          <Tabs
            value={authTab}
            onChange={(_, value) => setAuthTab(value)}
            sx={{ "& .MuiTabs-indicator": { backgroundColor: "#C4956F" } }}
          >
            <Tab label="Ingresar" />
            <Tab label="Registrarse" />
          </Tabs>

          {authError && <Alert severity="error">{authError}</Alert>}

          {authTab === 0 ? (
            <form onSubmit={(e) => { e.preventDefault(); handleSignin(); }} className="space-y-3">
              <Input
                placeholder="Email"
                type="email"
                value={signinForm.email}
                onChange={(event) => setSigninForm((prev) => ({ ...prev, email: event.target.value }))}
                disabled={authLoading}
              />
              <Input
                placeholder="Contraseña"
                type="password"
                value={signinForm.password}
                onChange={(event) => setSigninForm((prev) => ({ ...prev, password: event.target.value }))}
                disabled={authLoading}
              />
              <Button fullWidth type="submit" disabled={authLoading}>
                {authLoading ? <CircularProgress size={18} /> : "Ingresar"}
              </Button>
            </form>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); handleSignup(); }} className="space-y-3">
              <Input
                placeholder="Juan Pérez (nombre y apellido)"
                value={signupForm.name}
                onChange={(event) => setSignupForm((prev) => ({ ...prev, name: event.target.value }))}
                disabled={authLoading}
              />
              <Input
                placeholder="tu@email.com"
                type="email"
                value={signupForm.email}
                onChange={(event) => setSignupForm((prev) => ({ ...prev, email: event.target.value }))}
                disabled={authLoading}
              />
              <Input
                placeholder="Teléfono (+549...)"
                value={signupForm.phone}
                onChange={(event) => setSignupForm((prev) => ({ ...prev, phone: event.target.value }))}
                disabled={authLoading}
              />
              <Input
                placeholder="Contraseña segura (min. 8 caracteres)"
                type="password"
                value={signupForm.password}
                onChange={(event) => setSignupForm((prev) => ({ ...prev, password: event.target.value }))}
                disabled={authLoading}
              />
              <Input
                placeholder="Repetir contraseña"
                type="password"
                value={signupForm.confirmPassword}
                onChange={(event) => setSignupForm((prev) => ({ ...prev, confirmPassword: event.target.value }))}
                disabled={authLoading}
              />
              <Button fullWidth type="submit" disabled={authLoading}>
                {authLoading ? <CircularProgress size={18} /> : "Crear cuenta"}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={bookingModalOpen}
        onClose={() => {
          setBookingModalOpen(false);
          resetBookingState();
        }}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: "linear-gradient(145deg, rgba(250,248,246,0.98) 0%, rgba(255,249,245,0.96) 100%)",
            backdropFilter: "blur(14px)",
            border: "1px solid rgba(232,221,212,0.55)",
          },
        }}
      >
        <DialogContent className="space-y-5 p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-2xl text-[#8B7765]">Reserva premium</h3>
            <button
              onClick={() => {
                setBookingModalOpen(false);
                resetBookingState();
              }}
              className="rounded-lg p-1 text-[#8B7765] hover:bg-[#F0E8E1]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {bookingError && <Alert severity="error">{bookingError}</Alert>}
          {bookingSuccess && <Alert severity="success">{bookingSuccess}</Alert>}

          {!bookingSuccess && (
            <>
              <div className="space-y-3">
                <p className="text-sm font-semibold uppercase tracking-wide text-[#8B7765]">1) Servicios</p>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  {combos.map((combo) => (
                    <button
                      key={combo.id}
                      onClick={() => chooseCombo(combo.id)}
                      className={`rounded-lg border p-3 text-left transition ${
                        selectedComboId === combo.id
                          ? "border-[#C4956F] bg-[#FFF9F5]"
                          : "border-[#E8DDD4] hover:border-[#C4956F]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-[#8B7765]">{combo.name}</span>
                        <span className="text-sm font-semibold text-[#C4956F]">${combo.price}</span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  {services.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => toggleService(service.id)}
                      className={`rounded-lg border p-3 text-left transition ${
                        selectedServices.includes(service.id)
                          ? "border-[#C4956F] bg-[#FFF9F5]"
                          : "border-[#E8DDD4] hover:border-[#C4956F]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm text-[#8B7765]">{service.name}</span>
                        <span className="text-xs font-semibold text-[#C4956F]">${service.price}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="2) Profesional"
                  value={selectedStaffId}
                  onChange={(event) => {
                    setSelectedStaffId(event.target.value);
                    setSlots([]);
                    setSelectedSlot(null);
                  }}
                >
                  {staff.map((member) => (
                    <MenuItem key={member.id} value={member.id}>
                      {member.name}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  fullWidth
                  size="small"
                  type="date"
                  label="3) Fecha"
                  value={selectedDate}
                  onChange={(event) => {
                    setSelectedDate(event.target.value);
                    setSlots([]);
                    setSelectedSlot(null);
                  }}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: new Date().toISOString().split("T")[0] }}
                />
              </div>

              <Button onClick={loadAvailability} disabled={slotsLoading || !selectedStaffId || !selectedDate || selectedServices.length === 0}>
                {slotsLoading ? <CircularProgress size={18} /> : "Cargar horarios"}
              </Button>

              {slots.length > 0 && (
                <div className="grid grid-cols-3 gap-2 md:grid-cols-5">
                  {slots.map((slot) => {
                    const label = new Date(slot.startAt).toLocaleTimeString("es-AR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                    return (
                      <button
                        key={slot.startAt}
                        onClick={() => setSelectedSlot(slot)}
                        className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                          selectedSlot?.startAt === slot.startAt
                            ? "border-[#C4956F] bg-[#C4956F] text-white"
                            : "border-[#E8DDD4] text-[#8B7765] hover:border-[#C4956F]"
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <Input
                  placeholder="Nombre completo"
                  value={bookingForm.clientName}
                  onChange={(event) => setBookingForm((prev) => ({ ...prev, clientName: event.target.value }))}
                />
                <Input
                  placeholder="Email"
                  type="email"
                  value={bookingForm.clientEmail}
                  onChange={(event) => setBookingForm((prev) => ({ ...prev, clientEmail: event.target.value }))}
                />
                <Input
                  placeholder="Teléfono"
                  value={bookingForm.clientPhone}
                  onChange={(event) => setBookingForm((prev) => ({ ...prev, clientPhone: event.target.value }))}
                />
                <Input
                  placeholder="Notas (opcional)"
                  value={bookingForm.notes}
                  onChange={(event) => setBookingForm((prev) => ({ ...prev, notes: event.target.value }))}
                />
              </div>

              <Glass blur="sm" className="p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#8B7765]">Resumen</p>
                <div className="mt-2 space-y-1 text-sm text-[#7F7065]">
                  <p>Servicios: {selectedServicesData.length}</p>
                  <p>Total estimado: ${totalPrice}</p>
                  <p>Horario: {selectedSlot ? new Date(selectedSlot.startAt).toLocaleString("es-AR") : "No seleccionado"}</p>
                </div>
              </Glass>

              <Button onClick={submitBooking} disabled={bookingLoading || !selectedSlot} className="gap-2">
                {bookingLoading ? <CircularProgress size={18} /> : "Confirmar reserva"}
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
