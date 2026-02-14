"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Staff = {
  id: string;
  user: { name: string | null; email: string; active: boolean };
  services: Array<{ service: { name: string; category: string } }>;
};

export default function StaffPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [staff, setStaff] = useState<Staff[]>([]);

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
      router.push("/admin/login");
      return;
    }

    const fetchStaff = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        setLoading(true);
        const res = await fetch("/api/v1/staff", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        if (!data.success) throw new Error("Failed to fetch staff");

        setStaff(data.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error loading staff");
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

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
            <h3 className="text-lg font-semibold text-foreground">Team Members</h3>
            <p className="text-sm text-foreground/60">
              Manage staff members and their specialties.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-foreground/60">
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium">Specialties</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((member) => (
                  <tr key={member.id} className="border-b border-border/70 last:border-0">
                    <td className="px-5 py-3 font-medium text-foreground">
                      {member.user.name}
                    </td>
                    <td className="px-5 py-3 text-foreground/80">
                      {member.user.email}
                    </td>
                    <td className="px-5 py-3 text-foreground/80">
                      {member.services
                        ?.slice(0, 3)
                        .map((s) => s.service.name)
                        .join(", ") || "None"}
                    </td>
                    <td className="px-5 py-3">
                      <Badge
                        variant={member.user.active ? "success" : "destructive"}
                      >
                        {member.user.active ? "Active" : "Inactive"}
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
