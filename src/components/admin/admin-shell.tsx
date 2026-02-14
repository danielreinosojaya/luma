import { Bell, CalendarCheck, LayoutDashboard, Scissors, Settings, Users, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Glass } from "@/components/ui/glass";

const navigation = [
  { label: "Panel", icon: LayoutDashboard, href: "/admin" },
  { label: "Citas", icon: CalendarCheck, href: "/admin/appointments" },
  { label: "Personal", icon: Users, href: "/admin/staff" },
  { label: "Servicios", icon: Scissors, href: "/admin/services" },
  { label: "Configuraci\u00f3n", icon: Settings, href: "/admin/settings" },
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
    <div className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-4">
          <Glass className="rounded-2xl border-border bg-card p-4" blur="sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-foreground/60">Luma OS</p>
                <h1 className="font-display text-xl text-foreground">Admin</h1>
              </div>
              <Badge variant="outline">Empresarial</Badge>
            </div>

            <nav className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href === "/admin" && pathname === "/admin");

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={[
                      "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-all duration-200",
                      isActive
                        ? "bg-foreground/10 text-foreground font-medium"
                        : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground",
                    ].join(" ")}
                  >
                    <Icon className="size-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-6 border-t border-border pt-4">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-foreground/70 hover:bg-red-500/10 hover:text-red-600 transition-all duration-200"
              >
                <LogOut className="size-4" />
                Cerrar Sesi\u00f3n
              </button>
            </div>
          </Glass>
        </aside>

        <main className="space-y-6">
          <header className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-foreground/60">Centro de Operaciones</p>
              <h2 className="text-2xl font-semibold text-foreground">
                {navigation.find((n) => n.href === pathname)?.label || "Panel Admin"}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Bell className="size-4" />
                Alertas
              </Button>
              <Button size="sm">Crear Reserva</Button>
            </div>
          </header>

          {children}
        </main>
      </div>
    </div>
  );
}
