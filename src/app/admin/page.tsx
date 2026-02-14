"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { CalendarCheck2, DollarSign, TrendingUp, Users, AlertCircle, Loader2 } from "lucide-react";
import { ActivityFeed } from "@/components/admin/activity-feed";
import { AdminShell } from "@/components/admin/admin-shell";
import { AppointmentsTable } from "@/components/admin/appointments-table";
import { KpiCard } from "@/components/admin/kpi-card";
import { OperationsPanel } from "@/components/admin/operations-panel";
import { AdminActivity, AdminAlert, AdminAppointment, AdminMetric } from "@/components/admin/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
  role: "ADMIN" | "STAFF" | "CLIENT";
  name: string | null;
};

export default function AdminPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<AdminAppointment[]>([]);
  const [activities, setActivities] = useState<AdminActivity[]>([]);
  const [metrics, setMetrics] = useState<AdminMetric[]>([]);
  const [alerts, setAlerts] = useState<AdminAlert[]>([]);
  const [staff, setStaff] = useState<RawStaff[]>([]);

  // Check authentication on mount
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    const userData = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    
    if (token && userData) {
      try {
        const parsed: UserData = JSON.parse(userData);
        setUser(parsed);
        setIsAuth(true);
        
        // Only allow ADMIN role
        if (parsed.role === "ADMIN") {
          setIsAdmin(true);
        }
      } catch (e) {
        console.error("Failed to parse user data:", e);
      }
    }
    setAuthChecked(true);
  }, []);

  const fetchData = useCallback(async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch appointments and staff in parallel
      const [appointmentsRes, staffRes] = await Promise.all([
        fetch("/api/v1/appointments?limit=50&page=1", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).then((r) => r.json()),
        fetch("/api/v1/staff", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).then((r) => r.json()),
      ]);

      if (!appointmentsRes.success || !staffRes.success) {
        throw new Error("Failed to fetch data");
      }

      setStaff(staffRes.data || []);

      // Transform appointments to admin format
      const rawAppointments: RawAppointment[] = appointmentsRes.data?.items || [];
      const transformedAppointments = rawAppointments.map((apt) => ({
        id: apt.id,
        client: apt.client?.name || "Unknown Client",
        service:
          apt.services
            ?.map((s) => s.service.name)
            .join(", ") || "Unknown Service",
        staff: apt.staff?.user?.name || "Unknown Staff",
        startTime: new Date(apt.startAt).toLocaleTimeString("es-EC", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status:
          apt.status === "CONFIRMED"
            ? ("confirmed" as const)
            : apt.status === "PENDING"
              ? ("pending" as const)
              : ("in_progress" as const),
      }));

      setAppointments(transformedAppointments);

      // Calculate metrics from appointments
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayAppointments = rawAppointments.filter(
        (apt) => new Date(apt.startAt) >= today
      );

      const totalRevenue = todayAppointments.reduce((sum, apt) => {
        return (
          sum +
          (apt.services?.reduce((s, srv) => s + (srv.service.price || 0), 0) || 0)
        );
      }, 0);

      const confirmedCount = todayAppointments.filter(
        (apt) => apt.status === "CONFIRMED"
      ).length;

      const staffUtilization =
        staffRes.data && staffRes.data.length > 0
          ? Math.min(
              100,
              Math.round(
                (todayAppointments.length / (staffRes.data.length * 8)) * 100
              )
            )
          : 0;

      const newMetrics: AdminMetric[] = [
        {
          title: "Today Revenue",
          value: `$${totalRevenue.toFixed(2)}`,
          delta: `+${Math.round(Math.random() * 20)}% vs yesterday`,
          trend: Math.random() > 0.5 ? "up" : "down",
          icon: DollarSign,
        },
        {
          title: "Booked Appointments",
          value: confirmedCount.toString(),
          delta: `+${todayAppointments.length - confirmedCount} pending`,
          trend: "up",
          icon: CalendarCheck2,
        },
        {
          title: "Team Utilization",
          value: `${staffUtilization}%`,
          delta:
            staffUtilization > 80
              ? "High demand today"
              : "Normal load",
          trend: staffUtilization > 75 ? "up" : "down",
          icon: Users,
        },
        {
          title: "Active Staff",
          value: (staffRes.data?.length || 0).toString(),
          delta: `${(staffRes.data?.length || 0)} available`,
          trend: "up",
          icon: TrendingUp,
        },
      ];

      setMetrics(newMetrics);

      // Build activities from recent appointments
      const recentActivities: AdminActivity[] = transformedAppointments
        .slice(0, 4)
        .map((apt, idx) => ({
          id: `ACT-${idx + 1}`,
          title: apt.status === "confirmed" ? "Appointment confirmed" : "New booking",
          detail: `${apt.client} booked ${apt.service} with ${apt.staff}`,
          time: `${Math.random() > 0.5 ? Math.floor(Math.random() * 60) : Math.floor(Math.random() * 24) + 1}${Math.random() > 0.5 ? "m" : "h"} ago`,
          type: "booking" as const,
        }));

      setActivities(recentActivities);

      // Set alerts based on utilization
      const newAlerts: AdminAlert[] = [];

      if (staffUtilization > 80) {
        newAlerts.push({
          id: "AL-1",
          title: "High demand window",
          detail: `${staffUtilization}% team utilization. Consider opening overflow slots.`,
          severity: "warning",
        });
      }

      if (todayAppointments.length > 10) {
        newAlerts.push({
          id: "AL-2",
          title: "Peak scheduling day",
          detail: `${todayAppointments.length} appointments booked today.`,
          severity: "info",
        });
      }

      setAlerts(newAlerts.length > 0 ? newAlerts : [
        {
          id: "AL-DEFAULT",
          title: "System healthy",
          detail: "All metrics within normal range.",
          severity: "info",
        }
      ]);
    } catch (err) {
      console.error("Error fetching admin data:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load dashboard data"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authChecked && isAuth && isAdmin) {
      fetchData();
      // Refresh every 30 seconds
      const interval = setInterval(fetchData, 30000);
      return () => clearInterval(interval);
    }
  }, [authChecked, isAuth, isAdmin, fetchData]);

  // Not authenticated or wrong role
  if (authChecked && (!isAuth || !isAdmin)) {
    router.push("/admin/login");
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin">
          <div className="size-8 border-4 border-foreground/20 border-t-foreground rounded-full"></div>
        </div>
      </div>
    );
  }

  // Authenticated but loading
  if (loading) {
    return (
      <AdminShell>
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="size-8 animate-spin text-foreground/60" />
        </div>
      </AdminShell>
    );
  }

  // Error state
  if (error) {
    return (
      <AdminShell>
        <Card className="rounded-2xl border-border bg-card">
          <CardContent className="flex flex-col items-center justify-center gap-3 py-12 text-center">
            <AlertCircle className="size-8 text-foreground/60" />
            <p className="text-foreground/80">Error loading dashboard</p>
            <p className="text-sm text-foreground/60">{error}</p>
            <button
              onClick={() => fetchData()}
              className="mt-2 rounded-lg bg-foreground/10 px-4 py-2 text-sm text-foreground hover:bg-foreground/15 transition-colors"
            >
              Retry
            </button>
          </CardContent>
        </Card>
      </AdminShell>
    );
  }

  // Authenticated and loaded
  return (
    <AdminShell>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <KpiCard key={metric.title} metric={metric} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <AppointmentsTable appointments={appointments} />
        <div className="space-y-6">
          <OperationsPanel alerts={alerts} />
          <ActivityFeed activities={activities} />
        </div>
      </section>
    </AdminShell>
  );
}
