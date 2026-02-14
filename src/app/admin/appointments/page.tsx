"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { AppointmentsTable } from "@/components/admin/appointments-table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminAppointment } from "@/components/admin/types";

type RawAppointment = {
  id: string;
  startAt: string;
  endAt: string;
  status: string;
  staff: { user: { name: string | null; email: string } };
  client: { name: string | null; email: string };
  services: Array<{ service: { name: string; price: number } }>;
};

export default function AppointmentsPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<AdminAppointment[]>([]);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (token) {
      setIsAuth(true);
    }
    setAuthChecked(true);
  }, []);

  useEffect(() => {
    if (!authChecked) return;
    if (!isAuth) {
      setLoading(false);
      router.push("/admin/login");
      return;
    }

    const fetchAppointments = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        setLoading(true);
        const res = await fetch("/api/v1/appointments?limit=100&page=1", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        if (!data.success) throw new Error("Failed to fetch appointments");

        const rawAppointments: RawAppointment[] = data.data?.items || [];
        const transformed = rawAppointments.map((apt) => ({
          id: apt.id,
          client: apt.client?.name || "Unknown",
          service:
            apt.services
              ?.map((s) => s.service.name)
              .join(", ") || "Unknown",
          staff: apt.staff?.user?.name || "Unknown",
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

        setAppointments(transformed);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error loading appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [authChecked, isAuth, router]);

  if (loading) {
    return (
      <AdminShell>
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="size-8 animate-spin text-foreground/60" />
        </div>
      </AdminShell>
    );
  }

  if (error) {
    return (
      <AdminShell>
        <Card className="rounded-2xl border-border bg-card">
          <CardContent className="flex flex-col items-center justify-center gap-3 py-12 text-center">
            <AlertCircle className="size-8 text-foreground/60" />
            <p className="text-foreground/80">{error}</p>
          </CardContent>
        </Card>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <AppointmentsTable appointments={appointments} />
    </AdminShell>
  );
}
