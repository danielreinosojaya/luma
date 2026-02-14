import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AdminMetric } from "./types";

export function KpiCard({ metric }: { metric: AdminMetric }) {
  const TrendIcon = metric.trend === "up" ? ArrowUpRight : ArrowDownRight;
  const DeltaVariant = metric.trend === "up" ? "success" : "warning";
  const Icon = metric.icon;

  return (
    <Card className="rounded-2xl border-border bg-card">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm text-foreground/70">{metric.title}</p>
          <Icon className="size-4 text-foreground/60" />
        </div>

        <div className="space-y-2">
          <p className="text-2xl font-semibold text-foreground">{metric.value}</p>
          <Badge variant={DeltaVariant} className="gap-1">
            <TrendIcon className="size-3.5" />
            {metric.delta}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
