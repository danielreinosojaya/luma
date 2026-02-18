import { Circle, Search, Sparkles, Zap } from "lucide-react";
import { motion } from "framer-motion";
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
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <Card className="card card-enterprise" style={{
        padding: "3rem 2.5rem",
        borderRadius: "20px",
        boxShadow: "0 10px 30px rgba(2, 27, 24, 0.08)"
      }}>
        <CardContent className="p-0">
          <motion.div 
            className="mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="fw-bold mb-2" style={{ fontSize: "1.3rem", letterSpacing: "-0.5px" }}>Espacio Operativo</h3>
            <p className="small text-muted mb-0" style={{ fontSize: "0.95rem" }}>Acceso rápido a flujos de trabajo diarios y monitoreo de riesgos.</p>
          </motion.div>

          <motion.div 
            className="input-group mb-5" 
            style={{ gap: "0.75rem" }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <span className="input-group-text bg-white border-1" style={{ borderRadius: "12px", borderColor: "var(--border)" }}>
              <Search size={20} className="text-primary" />
            </span>
            <Input 
              placeholder="Buscar cita, cliente o personal..." 
              className="border-1"
              style={{
                borderRadius: "12px",
                padding: "0.875rem 1.5rem",
                fontSize: "1rem",
                borderColor: "var(--border)"
              }}
            />
          </motion.div>

          <motion.div 
            className="d-grid gap-3 mb-5" 
            style={{ gridTemplateColumns: "1fr 1fr" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" className="d-flex align-items-center justify-content-center gap-2" style={{ padding: "1rem", fontSize: "0.95rem" }}>
                <Sparkles size={18} />
                Optimizar
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" className="d-flex align-items-center justify-content-center gap-2" style={{ padding: "1rem", fontSize: "0.95rem" }}>
                <Zap size={18} />
                Reporte
              </Button>
            </motion.div>
          </motion.div>

          <div className="d-flex flex-column gap-3">
            {alerts.map((alert, index) => (
              <motion.div 
                key={alert.id} 
                className="border border-1 p-3" 
                style={{ borderRadius: "14px", borderColor: "var(--border)", backgroundColor: "#f9f8f7" }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.6 + (index * 0.1) }}
                whileHover={{ 
                  x: 5,
                  boxShadow: "0 4px 12px rgba(2, 27, 24, 0.1)",
                  transition: { duration: 0.2 }
                }}
              >
                <div className="d-flex align-items-start gap-3 mb-2">
                  <Circle size={16} className={`mt-1 flex-shrink-0 ${
                    alert.severity === "warning" ? "text-warning" : "text-info"
                  }`} fill="currentColor" />
                  <p className="small fw-500 text-dark mb-0" style={{ fontSize: "0.95rem" }}>{alert.title}</p>
                  <Badge variant={alertVariant[alert.severity]} className="ms-auto flex-shrink-0">
                    {alert.severity === "warning" ? "Alerta" : "Info"}
                  </Badge>
                </div>
                <p className="small text-muted mb-0" style={{ fontSize: "0.9rem", marginLeft: "2rem" }}>{alert.detail}</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
