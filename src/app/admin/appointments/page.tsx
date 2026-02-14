"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { AppointmentsTable } from "@/components/admin/appointments-table";
import { Card, CardContent } from "@/components/ui/card";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<AdminAppointment[]>([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/v1/appointments?limit=100&page=1");
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
  }, []);

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
