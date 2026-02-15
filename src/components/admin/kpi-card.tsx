import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AdminMetric } from "./types";

export function KpiCard({ metric }: { metric: AdminMetric }) {
  const TrendIcon = metric.trend === "up" ? ArrowUpRight : ArrowDownRight;
  const DeltaVariant = metric.trend === "up" ? "success" : "warning";
  const Icon = metric.icon;

  return (
    <Card className="card card-enterprise rounded-3 h-100">
      <CardContent className="p-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <p className="text-muted small mb-0">{metric.title}</p>
          <Icon className="text-muted" size={20} />
        </div>

        <div>
          <p className="h3 fw-bold mb-2 text-dark">{metric.value}</p>
          <Badge variant={DeltaVariant} className="d-inline-flex align-items-center gap-1">
            <TrendIcon size={14} />
            {metric.delta}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
