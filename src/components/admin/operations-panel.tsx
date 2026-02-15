import { Circle, Search, Sparkles, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AdminAlert } from "./types";

const alertVariant: Record<AdminAlert["severity"], "warning" | "info"> = {
  warning: "warning",
  info: "info",
};

export function OperationsPanel({ alerts }: { alerts: AdminAlert[] }) {
  return (
    <Card className="card card-enterprise">
      <CardContent className="p-4">
        <div className="mb-4">
          <h3 className="fw-bold mb-2">Espacio Operativo</h3>
          <p className="small text-muted mb-0">Acceso rápido a flujos de trabajo diarios y monitoreo de riesgos.</p>
        </div>

        <div className="input-group input-group-lg mb-4">
          <span className="input-group-text bg-white border-end-0">
            <Search size={20} className="text-muted" />
          </span>
          <Input 
            placeholder="Buscar cita, cliente o personal..." 
            className="border-start-0"
          />
        </div>

        <div className="d-grid gap-2 gap-lg-3 grid-template-columns-2 mb-4">
          <Button variant="outline" size="sm" className="d-flex align-items-center justify-content-center gap-2 w-100">
            <Sparkles size={16} />
            Optimizar
          </Button>
          <Button variant="outline" size="sm" className="d-flex align-items-center justify-content-center gap-2 w-100">
            <Zap size={16} />
            Reporte
          </Button>
        </div>

        <div className="d-flex flex-column gap-2">
          {alerts.map((alert) => (
            <div key={alert.id} className="rounded-2 border border-light p-3">
              <div className="d-flex align-items-start gap-2 mb-2">
                <Circle size={14} className={`mt-1 flex-shrink-0 ${
                  alert.severity === "warning" ? "text-warning" : "text-info"
                }`} fill="currentColor" />
                <p className="small fw-500 text-dark mb-0">{alert.title}</p>
                <Badge variant={alertVariant[alert.severity]} className="ms-auto flex-shrink-0">
                  {alert.severity === "warning" ? "Alerta" : "Info"}
                </Badge>
              </div>
              <p className="small text-muted mb-0 ms-4">{alert.detail}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
