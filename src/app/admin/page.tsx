'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarCheck2, DollarSign, TrendingUp, Users, AlertCircle, Loader2, LogOut } from 'lucide-react';

type RawAppointment = {
  id: string;
  startAt: string;
  endAt: string;
  status: string;
  staff: { user: { name: string | null; email: string } };
  client: { name: string | null; email: string };
  services: Array<{ service: { name: string; price: number } }>;
  payment: { status?: string; amount?: number } | null;
};

type RawStaff = {
  id: string;
  user: { name: string | null; email: string };
};

type UserData = {
  id: string;
  email: string;
  role: 'ADMIN' | 'STAFF' | 'CLIENT';
  name: string | null;
};

export default function AdminPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [staff, setStaff] = useState<RawStaff[]>([]);
  const [metrics, setMetrics] = useState<any[]>([]);

  // Check authentication on mount
  useEffect(() => {
    setIsMounted(true);
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    const userData = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    
    if (token && userData) {
      try {
        const parsed: UserData = JSON.parse(userData);
        setUser(parsed);
        setIsAuth(true);
        
        if (parsed.role === 'ADMIN') {
          setIsAdmin(true);
        } else {
          setIsAuth(false);
        }
      } catch (e) {
        console.error('Failed to parse user data:', e);
        setIsAuth(false);
      }
    } else {
      setIsAuth(false);
    }
    setAuthChecked(true);
  }, []);

  const fetchData = useCallback(async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [appointmentsRes, staffRes] = await Promise.all([
        fetch('/api/v1/appointments?limit=50&page=1', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).then((r) => r.json()),
        fetch('/api/v1/staff', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).then((r) => r.json()),
      ]);

      if (!appointmentsRes.success || !staffRes.success) {
        throw new Error('Error al obtener datos');
      }

      setStaff(staffRes.data || []);

      const rawAppointments: RawAppointment[] = appointmentsRes.data?.items || [];
      const transformedAppointments = rawAppointments.map((apt) => ({
        id: apt.id,
        client: apt.client?.name || 'Cliente Desconocido',
        service: apt.services?.map((s) => s.service.name).join(', ') || 'Servicio Desconocido',
        staff: apt.staff?.user?.name || 'Personal Desconocido',
        time: new Date(apt.startAt).toLocaleTimeString('es-EC', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        status: apt.status === 'CONFIRMED' ? 'confirmed' : apt.status === 'PENDING' ? 'pending' : 'in_progress',
      }));

      setAppointments(transformedAppointments);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayAppointments = rawAppointments.filter(
        (apt) => new Date(apt.startAt) >= today
      );

      const totalRevenue = todayAppointments.reduce((sum, apt) => {
        return sum + (apt.services?.reduce((s, srv) => s + (srv.service.price || 0), 0) || 0);
      }, 0);

      const confirmedCount = todayAppointments.filter(
        (apt) => apt.status === 'CONFIRMED'
      ).length;

      const staffUtilization = staffRes.data && staffRes.data.length > 0
        ? Math.min(100, Math.round((todayAppointments.length / (staffRes.data.length * 8)) * 100))
        : 0;

      setMetrics([
        {
          title: 'Ingresos Hoy',
          value: `$${totalRevenue.toFixed(2)}`,
          icon: DollarSign,
          color: 'bg-blue-100 text-blue-600',
        },
        {
          title: 'Citas Reservadas',
          value: confirmedCount.toString(),
          icon: CalendarCheck2,
          color: 'bg-green-100 text-green-600',
        },
        {
          title: 'Utilización',
          value: `${staffUtilization}%`,
          icon: TrendingUp,
          color: 'bg-purple-100 text-purple-600',
        },
        {
          title: 'Personal Activo',
          value: (staffRes.data?.length || 0).toString(),
          icon: Users,
          color: 'bg-orange-100 text-orange-600',
        },
      ]);

      setLoading(false);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar los datos del panel');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authChecked && isAuth && isAdmin) {
      fetchData();
      const interval = setInterval(fetchData, 30000);
      return () => clearInterval(interval);
    }
  }, [authChecked, isAuth, isAdmin, fetchData]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    router.push('/admin/login');
  };

  // Show loading while checking auth and before mounted
  if (!isMounted || !authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="size-8 animate-spin text-gray-400" />
      </div>
    );
  }

  // Redirect if not authenticated or not admin
  if (!isAuth || !isAdmin) {
    if (isMounted) {
      router.push('/admin/login');
    }
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl text-black">LUMA</h1>
            <p className="text-xs text-gray-500 tracking-widest mt-1">PANEL ADMINISTRATIVO</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.name || user?.email}</p>
              <p className="text-xs text-gray-500">Administrador</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Cerrar sesión"
            >
              <LogOut size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8">
            <a href="/admin" className="py-3 px-0 text-sm font-medium text-black border-b-2 border-black">Dashboard</a>
            <a href="/admin/appointments" className="py-3 px-0 text-sm text-gray-600 hover:text-black transition-colors border-b-2 border-transparent">Citas</a>
            <a href="/admin/services" className="py-3 px-0 text-sm text-gray-600 hover:text-black transition-colors border-b-2 border-transparent">Servicios</a>
            <a href="/admin/staff" className="py-3 px-0 text-sm text-gray-600 hover:text-black transition-colors border-b-2 border-transparent">Personal</a>
            <a href="/admin/settings" className="py-3 px-0 text-sm text-gray-600 hover:text-black transition-colors border-b-2 border-transparent">Configuración</a>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 flex gap-3">
            <AlertCircle className="size-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-900">Error al cargar datos</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              <button
                onClick={() => fetchData()}
                className="mt-3 text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Reintentar
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="size-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <>
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {metrics.map((metric) => (
                <div key={metric.title} className="rounded-lg border border-gray-200 bg-white p-6">
                  <div className={`w-12 h-12 rounded-lg ${metric.color} flex items-center justify-center mb-4`}>
                    <metric.icon size={24} />
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{metric.title}</p>
                  <p className="text-3xl font-serif font-bold text-black">{metric.value}</p>
                </div>
              ))}
            </div>

            {/* Appointments Table */}
            <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-serif font-bold text-black">Citas de Hoy</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Cliente</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Servicio</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Personal</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Hora</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.length > 0 ? (
                      appointments.map((apt) => (
                        <tr key={apt.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm text-gray-900">{apt.client}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{apt.service}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{apt.staff}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{apt.time}</td>
                          <td className="px-6 py-4 text-sm">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                              apt.status === 'confirmed'
                                ? 'bg-green-100 text-green-700'
                                : apt.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              {apt.status === 'confirmed' ? 'Confirmada' : apt.status === 'pending' ? 'Pendiente' : 'En Curso'}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                          No hay citas para hoy
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
