import { Bell, CalendarCheck, LayoutDashboard, Scissors, Settings, Users, LogOut, ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const navigation = [
  { label: "Panel", icon: LayoutDashboard, href: "/admin", badge: null },
  { label: "Citas", icon: CalendarCheck, href: "/admin/appointments", badge: null },
  { label: "Personal", icon: Users, href: "/admin/staff", badge: null },
  { label: "Servicios", icon: Scissors, href: "/admin/services", badge: null },
  { label: "Configuración", icon: Settings, href: "/admin/settings", badge: null },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    router.push("/admin/login");
  };

  return (
    <div className="d-flex min-vh-100">
      {/* Sidebar Navigation */}
      <aside className="bg-dark text-white d-flex flex-column" style={{ width: "280px", minHeight: "100vh", overflowY: "auto" }}>
        {/* Brand */}
        <div className="p-4 border-bottom border-secondary">
          <div className="d-flex align-items-center gap-2">
            <div className="gradient-primary p-2 rounded-2" style={{ width: "40px", height: "40px" }}>
              <span className="text-white fw-bold">✨</span>
            </div>
            <div>
              <p className="text-muted small mb-0">LUMA</p>
              <h5 className="mb-0 fw-bold">Admin Panel</h5>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-grow-1 p-3">
          <ul className="list-unstyled">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <li key={item.label} className="mb-1">
                  <Link
                    href={item.href}
                    className={`d-flex align-items-center gap-2 px-3 py-3 rounded-2 text-decoration-none transition-all ${
                      isActive
                        ? "bg-primary text-white"
                        : "text-muted hover:bg-secondary text-reset"
                    }`}
                    style={{ cursor: "pointer" }}
                  >
                    <Icon size={20} />
                    <span className="flex-grow-1">{item.label}</span>
                    {item.badge && (
                      <Badge variant="danger">{item.badge}</Badge>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-3 border-top border-secondary">
          <button
            onClick={handleLogout}
            className="w-100 btn btn-outline-danger btn-sm d-flex align-items-center justify-content-center gap-2"
          >
            <LogOut size={18} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow-1 bg-light" style={{ overflow: "auto" }}>
        {/* Top Header */}
        <header className="bg-white border-bottom border-light shadow-sm p-4 sticky-top">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <p className="text-muted small text-uppercase tracking-wide mb-0">Centro de Operaciones</p>
              <h1 className="h2 fw-bold mb-0">
                {navigation.find((n) => n.href === pathname)?.label || "Panel Admin"}
              </h1>
            </div>
            <div className="d-flex align-items-center gap-3">
              <button className="btn btn-light position-relative">
                <Bell size={20} />
                <span className="position-absolute top-0 end-0 translate-middle badge rounded-pill bg-danger">
                  3
                </span>
              </button>
              <div className="d-flex align-items-center gap-2 ps-3 border-start border-light">
                <div>
                  <p className="fw-bold small mb-0">Admin</p>
                  <p className="text-muted small mb-0">online</p>
                </div>
                <img 
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin" 
                  alt="Avatar"
                  className="rounded-circle"
                  width="40"
                  height="40"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-4">
          {children}
        </div>
      </main>
    </div>
  );
}
