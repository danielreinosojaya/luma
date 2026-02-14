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
    <Card className="rounded-2xl border-border bg-card">
      <CardContent className="space-y-4 p-5">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
          <p className="text-sm text-foreground/60">Operational events from bookings, payments and team updates.</p>
        </div>

        <ul className="space-y-3">
          {activities.map((activity) => {
            const Icon = activityIcon[activity.type];
            return (
              <li key={activity.id} className="flex items-start gap-3 rounded-xl border border-border p-3">
                <div className="rounded-lg bg-foreground/10 p-2 text-foreground">
                  <Icon className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">{activity.title}</p>
                  <p className="text-sm text-foreground/70">{activity.detail}</p>
                </div>
                <p className="shrink-0 text-xs text-foreground/60">{activity.time}</p>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
