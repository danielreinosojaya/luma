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
    <Card className="card card-enterprise" style={{
      borderRadius: "20px",
      overflow: "hidden",
      boxShadow: "0 10px 30px rgba(2, 27, 24, 0.08)"
    }}>
      <CardContent className="p-0">
        <div className="border-bottom border-1 p-4" style={{ borderColor: "var(--border)", backgroundColor: "#f9f8f7" }}>
          <h3 className="fw-bold mb-2" style={{ fontSize: "1.3rem", letterSpacing: "-0.5px" }}>Citas de Hoy</h3>
          <p className="small text-muted mb-0" style={{ fontSize: "0.95rem" }}>Cola en vivo con asignación de equipo y estado actual.</p>
        </div>

        <div className="table-responsive">
          <table className="table-enterprise table mb-0">
            <thead>
              <tr>
                <th style={{ padding: "1.5rem 1.25rem", fontSize: "0.95rem" }}>Cliente</th>
                <th style={{ padding: "1.5rem 1.25rem", fontSize: "0.95rem" }}>Servicio</th>
                <th style={{ padding: "1.5rem 1.25rem", fontSize: "0.95rem" }}>Personal</th>
                <th style={{ padding: "1.5rem 1.25rem", fontSize: "0.95rem" }}>Hora</th>
                <th style={{ padding: "1.5rem 1.25rem", fontSize: "0.95rem" }}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td className="fw-500" style={{ padding: "1.25rem" }}>{appointment.client}</td>
                  <td style={{ padding: "1.25rem" }}>{appointment.service}</td>
                  <td style={{ padding: "1.25rem" }}>{appointment.staff}</td>
                  <td style={{ padding: "1.25rem" }}>{appointment.startTime}</td>
                  <td style={{ padding: "1.25rem" }}>
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
