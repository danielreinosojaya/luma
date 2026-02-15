import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AdminAppointment } from "./types";

const statusVariant: Record<AdminAppointment["status"], "success" | "warning" | "info"> = {
  confirmed: "success",
  pending: "warning",
  in_progress: "info",
};

const statusLabel: Record<AdminAppointment["status"], string> = {
  confirmed: "Confirmada",
  pending: "Pendiente",
  in_progress: "En Progreso",
};

export function AppointmentsTable({ appointments }: { appointments: AdminAppointment[] }) {
  return (
    <Card className="card card-enterprise">
      <CardContent className="p-0">
        <div className="border-bottom p-4">
          <h3 className="fw-bold mb-2">Citas de Hoy</h3>
          <p className="small text-muted mb-0">Cola en vivo con asignación de equipo y estado actual.</p>
        </div>

        <div className="table-responsive">
          <table className="table-enterprise table mb-0">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Servicio</th>
                <th>Personal</th>
                <th>Hora</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td className="fw-500">{appointment.client}</td>
                  <td>{appointment.service}</td>
                  <td>{appointment.staff}</td>
                  <td>{appointment.startTime}</td>
                  <td>
                    <Badge variant={statusVariant[appointment.status]}>
                      {statusLabel[appointment.status]}
                    </Badge>
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
