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
    <Card className="card card-enterprise" style={{
      padding: "3rem 2.5rem",
      borderRadius: "20px",
      boxShadow: "0 10px 30px rgba(2, 27, 24, 0.08)"
    }}>
      <CardContent className="p-0">
        <div className="mb-4">
          <h3 className="fw-bold mb-2" style={{ fontSize: "1.3rem", letterSpacing: "-0.5px" }}>Actividad Reciente</h3>
          <p className="small text-muted mb-0" style={{ fontSize: "0.95rem" }}>Eventos operacionales de reservas, pagos y actualizaciones del equipo.</p>
        </div>

        <ul className="list-unstyled">
          {activities.map((activity, index) => {
            const Icon = activityIcon[activity.type];
            return (
              <li key={activity.id} className={`d-flex align-items-start gap-3 p-3 ${
                index !== activities.length - 1 ? "border-bottom border-1" : ""
              }`} style={{ borderColor: "var(--border)", borderRadius: "12px", marginBottom: "0.5rem" }}>
                <div className="p-2 rounded-3 text-primary flex-shrink-0" style={{ backgroundColor: "#f5f0e8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={20} />
                </div>
                <div className="flex-grow-1 min-w-0">
                  <p className="small fw-500 mb-1 text-dark" style={{ fontSize: "0.95rem" }}>{activity.title}</p>
                  <p className="small text-muted mb-0" style={{ fontSize: "0.9rem" }}>{activity.detail}</p>
                </div>
                <p className="small text-muted flex-shrink-0 ms-2" style={{ fontSize: "0.9rem", whiteSpace: "nowrap" }}>{activity.time}</p>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
