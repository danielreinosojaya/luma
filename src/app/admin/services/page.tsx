"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Service = {
  id: string;
  name: string;
  category: string;
  price: number;
  durationMin: number;
  active: boolean;
};

const categoryColor: Record<string, "success" | "warning" | "secondary"> = {
  HAIR: "secondary",
  NAILS: "warning",
  BROWS: "secondary",
  LASHES: "success",
};

export default function ServicesPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (token) {
      setIsAuth(true);
    }
    setAuthChecked(true);
  }, []);

  useEffect(() => {
    if (!authChecked) return;
    if (!isAuth) {
      setLoading(false);
      router.push("/admin/login");
      return;
    }

    const fetchServices = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        setLoading(true);
        const res = await fetch("/api/v1/services", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        if (!data.success) throw new Error("Failed to fetch services");

        setServices(data.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error loading services");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [authChecked, isAuth, router]);

  if (loading) {
    return (
      <AdminShell>
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="size-8 animate-spin text-foreground/60" />
        </div>
      </AdminShell>
    );
  }

  if (error) {
    return (
      <AdminShell>
        <Card className="rounded-2xl border-border bg-card">
          <CardContent className="flex flex-col items-center justify-center gap-3 py-12 text-center">
            <AlertCircle className="size-8 text-foreground/60" />
            <p className="text-foreground/80">{error}</p>
          </CardContent>
        </Card>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <Card className="rounded-2xl border-border bg-card">
        <CardContent className="p-0">
          <div className="border-b border-border px-5 py-4">
            <h3 className="text-lg font-semibold text-foreground">Services Catalog</h3>
            <p className="text-sm text-foreground/60">
              Manage beauty services and pricing.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-foreground/60">
                  <th className="px-5 py-3 font-medium">Service</th>
                  <th className="px-5 py-3 font-medium">Category</th>
                  <th className="px-5 py-3 font-medium">Duration</th>
                  <th className="px-5 py-3 font-medium">Price</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr key={service.id} className="border-b border-border/70 last:border-0">
                    <td className="px-5 py-3 font-medium text-foreground">
                      {service.name}
                    </td>
                    <td className="px-5 py-3 text-foreground/80">
                      <Badge
                        variant={
                          categoryColor[service.category] || "secondary"
                        }
                      >
                        {service.category}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 text-foreground/80">
                      {service.durationMin}m
                    </td>
                    <td className="px-5 py-3 font-semibold text-foreground">
                      ${service.price.toFixed(2)}
                    </td>
                    <td className="px-5 py-3">
                      <Badge
                        variant={service.active ? "success" : "destructive"}
                      >
                        {service.active ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </AdminShell>
  );
}
