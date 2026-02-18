import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AdminMetric } from "./types";

export function KpiCard({ metric }: { metric: AdminMetric }) {
  const TrendIcon = metric.trend === "up" ? ArrowUpRight : ArrowDownRight;
  const DeltaVariant = metric.trend === "up" ? "success" : "warning";
  const Icon = metric.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ 
        y: -5,
        boxShadow: "0 15px 40px rgba(2, 27, 24, 0.15)",
        transition: { duration: 0.3 }
      }}
    >
      <Card className="card card-enterprise h-100" style={{
        padding: "3rem 2.5rem",
        borderRadius: "20px",
        boxShadow: "0 10px 30px rgba(2, 27, 24, 0.08)"
      }}>
        <CardContent className="p-0">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <p className="text-muted small mb-0 fw-500" style={{ fontSize: "0.95rem", letterSpacing: "0.5px" }}>
              {metric.title}
            </p>
            <motion.div 
              className="p-2 rounded-3" 
              style={{ backgroundColor: "#f5f0e8", display: "flex", alignItems: "center", justifyContent: "center" }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.3 }}
            >
              <Icon className="text-primary" size={24} />
            </motion.div>
          </div>

          <div>
            <motion.h2 
              className="fw-bold mb-2 text-dark" 
              style={{
                fontSize: "2.5rem",
                lineHeight: "1.2",
                letterSpacing: "-0.5px"
              }}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {metric.value}
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Badge variant={DeltaVariant} className="d-inline-flex align-items-center gap-2" style={{
                padding: "0.5rem 0.875rem",
                fontSize: "0.85rem",
                fontWeight: "600"
              }}>
                <TrendIcon size={16} />
                {metric.delta}
              </Badge>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
