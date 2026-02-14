import { CircleAlert, Search, Sparkles, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AdminAlert } from "./types";

const alertVariant: Record<AdminAlert["severity"], "warning" | "secondary"> = {
  warning: "warning",
  info: "secondary",
};

export function OperationsPanel({ alerts }: { alerts: AdminAlert[] }) {
  return (
    <Card className="rounded-2xl border-border bg-card">
      <CardContent className="space-y-5 p-5">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Espacio Operativo</h3>
          <p className="text-sm text-foreground/60">Acceso rápido a flujos de trabajo diarios y monitoreo de riesgos.</p>
        </div>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-foreground/50" />
          <Input placeholder="Buscar cita, cliente o personal..." className="pl-9" />
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <Button variant="outline" className="justify-start gap-2">
            <Sparkles className="size-4" />
            Optimizar Horarios
          </Button>
          <Button variant="outline" className="justify-start gap-2">
            <Zap className="size-4" />
            Generar Reporte
          </Button>
        </div>

        <div className="space-y-2">
          {alerts.map((alert) => (
            <div key={alert.id} className="rounded-xl border border-border p-3">
              <div className="mb-1 flex items-center gap-2">
                <CircleAlert className="size-4 text-foreground/70" />
                <p className="text-sm font-medium text-foreground">{alert.title}</p>
                <Badge variant={alertVariant[alert.severity]}>{alert.severity}</Badge>
              </div>
              <p className="text-sm text-foreground/70">{alert.detail}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
