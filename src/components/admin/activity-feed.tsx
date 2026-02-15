import { CalendarPlus2, CreditCard, UserRoundCog } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AdminActivity } from "./types";

const activityIcon = {
  booking: CalendarPlus2,
  payment: CreditCard,
  staff: UserRoundCog,
};

export function ActivityFeed({ activities }: { activities: AdminActivity[] }) {
  return (
    <Card className="card card-enterprise">
      <CardContent className="p-4">
        <div className="mb-4">
          <h3 className="fw-bold mb-2">Actividad Reciente</h3>
          <p className="small text-muted mb-0">Eventos operacionales de reservas, pagos y actualizaciones del equipo.</p>
        </div>

        <ul className="list-unstyled">
          {activities.map((activity, index) => {
            const Icon = activityIcon[activity.type];
            return (
              <li key={activity.id} className={`d-flex align-items-start gap-3 p-3 rounded-2 ${
                index !== activities.length - 1 ? "border-bottom" : ""
              }`}>
                <div className="bg-light p-2 rounded-2 text-primary flex-shrink-0">
                  <Icon size={18} />
                </div>
                <div className="flex-grow-1 min-w-0">
                  <p className="small fw-500 mb-1 text-dark">{activity.title}</p>
                  <p className="small text-muted mb-0">{activity.detail}</p>
                </div>
                <p className="small text-muted flex-shrink-0 ms-2">{activity.time}</p>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
