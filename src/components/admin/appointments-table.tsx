import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AdminAppointment } from "./types";

const statusVariant: Record<AdminAppointment["status"], "success" | "warning" | "secondary"> = {
  confirmed: "success",
  pending: "warning",
  in_progress: "secondary",
};

const statusLabel: Record<AdminAppointment["status"], string> = {
  confirmed: "Confirmada",
  pending: "Pendiente",
  in_progress: "En Progreso",
};

export function AppointmentsTable({ appointments }: { appointments: AdminAppointment[] }) {
  return (
    <Card className="rounded-2xl border-border bg-card">
      <CardContent className="p-0">
        <div className="border-b border-border px-5 py-4">
          <h3 className="text-lg font-semibold text-foreground">Citas de Hoy</h3>
          <p className="text-sm text-foreground/60">Cola en vivo con asignaci\u00f3n de equipo y estado actual.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-foreground/60">
                <th className="px-5 py-3 font-medium">Cliente</th>
                <th className="px-5 py-3 font-medium">Servicio</th>
                <th className="px-5 py-3 font-medium">Personal</th>
                <th className="px-5 py-3 font-medium">Hora</th>
                <th className="px-5 py-3 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id} className="border-b border-border/70 last:border-0">
                  <td className="px-5 py-3 text-foreground">{appointment.client}</td>
                  <td className="px-5 py-3 text-foreground/80">{appointment.service}</td>
                  <td className="px-5 py-3 text-foreground/80">{appointment.staff}</td>
                  <td className="px-5 py-3 text-foreground/80">{appointment.startTime}</td>
                  <td className="px-5 py-3">
                    <Badge variant={statusVariant[appointment.status]}>{statusLabel[appointment.status]}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
