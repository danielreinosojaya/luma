"use client";

import { useState, useEffect } from "react";
import { Bell, CalendarCheck, LayoutDashboard, Scissors, Settings, Users, LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Cerrar sidebar cuando cambiae la ruta (en móvil)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    router.push("/admin/login");
  };

  const SidebarContent = () => (
    <>
      {/* Brand */}
      <div className="px-4 py-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-lg">✨</span>
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-500 tracking-widest uppercase font-medium">LUMA</p>
            <h5 className="font-bold text-gray-900 text-sm">Admin Panel</h5>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100 active:bg-gray-200"
                  }`}
                >
                  <Icon size={20} className="flex-shrink-0" />
                  <span className="flex-1 min-w-0 truncate">{item.label}</span>
                  {item.badge && (
                    <Badge variant="danger" className="flex-shrink-0">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 active:bg-red-100 transition-colors duration-200"
        >
          <LogOut size={18} />
          <span className="hidden sm:inline">Cerrar Sesión</span>
          <span className="sm:hidden">Salir</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50" suppressHydrationWarning>
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 flex-col z-40">
        <SidebarContent />
      </aside>

      {/* Mobile Header + Sidebar Drawer */}
      <div className="lg:hidden">
        {/* Mobile Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 -ml-2"
              >
                <Menu size={24} className="text-gray-700" />
              </button>
              <h1 className="font-bold text-gray-900 text-lg">
                {navigation.find((n) => n.href === pathname)?.label || "Panel"}
              </h1>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 relative">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Mobile Sidebar Drawer */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setSidebarOpen(false)}
                className="fixed inset-0 bg-black/30 z-40 lg:hidden"
              />

              {/* Sidebar */}
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="fixed left-0 top-0 bottom-0 w-64 max-w-xs bg-white z-50 flex flex-col overflow-hidden"
              >
                {/* Close Button */}
                <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
                  <span className="font-bold text-gray-900">Menú</span>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 -mr-2"
                  >
                    <X size={24} className="text-gray-700" />
                  </button>
                </div>

                {/* Sidebar Content */}
                <SidebarContent />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen bg-gray-50">
        {/* Top Header - Desktop Only */}
        <header className="hidden lg:block sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 tracking-widest uppercase font-medium">Centro de Operaciones</p>
                <h1 className="text-2xl font-bold text-gray-900 mt-1">
                  {navigation.find((n) => n.href === pathname)?.label || "Panel Admin"}
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 relative">
                  <Bell size={20} className="text-gray-600" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                  <div className="text-right">
                    <p className="font-bold text-sm text-gray-900">Admin</p>
                    <p className="text-xs text-gray-500">online</p>
                  </div>
                  <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
                    alt="Avatar"
                    className="w-10 h-10 rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}

