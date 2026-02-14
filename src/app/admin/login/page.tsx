"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@luma.ec");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/v1/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Credenciales inválidas");
        setLoading(false);
        return;
      }

      const user = data.data.user;

      // Check if user is ADMIN
      if (user.role !== "ADMIN") {
        setError(`Acceso denegado. Tu rol es ${user.role}. Se requiere acceso de administrador.`);
        setLoading(false);
        return;
      }

      // Store tokens and user data
      localStorage.setItem("accessToken", data.data.tokens.accessToken);
      localStorage.setItem("refreshToken", data.data.tokens.refreshToken);
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect to admin dashboard
      router.push("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-foreground/5 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-md flex-col items-center justify-center gap-8 py-20">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Lock className="size-6 text-foreground" />
            <h1 className="font-display text-3xl text-foreground">Portal Admin</h1>
          </div>
          <Badge variant="outline">Luma OS - Acceso Empresarial</Badge>
        </div>

        {/* Login Card */}
        <Card className="rounded-2xl border-border bg-card w-full shadow-lg">
          <CardContent className="p-6 space-y-6">
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Correo Admin
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-foreground/50" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@luma.ec"
                    disabled={loading}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-foreground/50" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={loading}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50/50 p-3 flex gap-2">
                  <AlertCircle className="size-4 text-red-600 mt-0.5 shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Login Button */}
              <Button
                type="submit"
                disabled={loading}
                fullWidth
                className="h-11 font-medium"
              >
                {loading ? "Iniciando sesión..." : "Ingresar"}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card px-2 text-foreground/60">Credenciales de Demostración</span>
              </div>
            </div>

            {/* Demo Credentials */}
            <div className="rounded-xl bg-foreground/5 p-3 space-y-2 text-xs">
              <p className="font-medium text-foreground">Cuenta Admin de Prueba:</p>
              <div className="space-y-1 text-foreground/70 font-mono">
                <p>Email: <span className="text-foreground">admin@luma.ec</span></p>
                <p>Contraseña: <span className="text-foreground">password123</span></p>
              </div>
            </div>

            {/* Back to Home */}
            <Button
              variant="outline"
              fullWidth
              onClick={() => router.push("/")}
              disabled={loading}
            >
              Volver al Portal de Clientes
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-xs text-foreground/50 text-center max-w-xs">
          Esta es un área segura de administrador. El acceso no autorizado está prohibido. Contacta con soporte si necesitas ayuda.
        </p>
      </div>
    </div>
  );
}
