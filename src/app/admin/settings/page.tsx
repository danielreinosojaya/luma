"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Lock, User } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!token) {
      router.push("/");
    }
  }, [router]);

  return (
    <AdminShell>
      <div className="space-y-6">
        <Card className="rounded-2xl border-border bg-card">
          <CardContent className="space-y-6 p-6">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <User className="size-5 text-foreground/70" />
                <h3 className="text-lg font-semibold text-foreground">
                  Account Settings
                </h3>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-foreground/70 mb-2">
                      Full Name
                    </label>
                    <Input placeholder="Admin Name" readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground/70 mb-2">
                      Email
                    </label>
                    <Input placeholder="admin@luma.beauty" readOnly />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border bg-card">
          <CardContent className="space-y-6 p-6">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <Lock className="size-5 text-foreground/70" />
                <h3 className="text-lg font-semibold text-foreground">
                  Security
                </h3>
              </div>
              <div className="space-y-4">
                <p className="text-sm text-foreground/60">
                  Manage your password and security settings.
                </p>
                <Button variant="outline">Change Password</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border bg-card">
          <CardContent className="space-y-6 p-6">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <Bell className="size-5 text-foreground/70" />
                <h3 className="text-lg font-semibold text-foreground">
                  Notifications
                </h3>
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded"
                  />
                  <span className="text-sm text-foreground/70">
                    Email notifications for new bookings
                  </span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded"
                  />
                  <span className="text-sm text-foreground/70">
                    Alert on high demand periods
                  </span>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
