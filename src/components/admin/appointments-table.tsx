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
    <Card className="rounded-xl lg:rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
      <CardContent className="p-0">
        {/* Header */}
        <div className="border-b border-gray-200 bg-gray-50 px-4 sm:px-6 py-4 sm:py-6">
          <h3 className="font-bold text-base sm:text-lg text-gray-900">Citas de Hoy</h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Cola en vivo con asignación de equipo y estado actual.</p>
        </div>

        {/* Desktop Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Servicio</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Personal</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Hora</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {appointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{appointment.client}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{appointment.service}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{appointment.staff}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{appointment.startTime}</td>
                  <td className="px-6 py-4">
                    <Badge variant={statusVariant[appointment.status]}>
                      {statusLabel[appointment.status]}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile List View */}
        <div className="sm:hidden divide-y divide-gray-200">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="px-4 py-4 space-y-3 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Cliente</p>
                  <p className="text-sm font-medium text-gray-900 truncate">{appointment.client}</p>
                </div>
                <Badge variant={statusVariant[appointment.status]} className="flex-shrink-0">
                  {statusLabel[appointment.status]}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <p className="font-semibold text-gray-500 uppercase tracking-wider">Servicio</p>
                  <p className="text-gray-900 line-clamp-2">{appointment.service}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-500 uppercase tracking-wider">Personal</p>
                  <p className="text-gray-900 truncate">{appointment.staff}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-500 uppercase tracking-wider">Hora</p>
                  <p className="text-gray-900">{appointment.startTime}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
