import { LucideIcon } from "lucide-react";

export type AdminMetric = {
  title: string;
  value: string;
  delta: string;
  trend: "up" | "down";
  icon: LucideIcon;
};

export type AdminAppointment = {
  id: string;
  client: string;
  service: string;
  staff: string;
  startTime: string;
  status: "confirmed" | "pending" | "in_progress";
};

export type AdminActivity = {
  id: string;
  title: string;
  detail: string;
  time: string;
  type: "booking" | "payment" | "staff";
};

export type AdminAlert = {
  id: string;
  title: string;
  detail: string;
  severity: "warning" | "info";
};
