'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, Lock, Mail, ArrowRight } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@luma.ec');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/v1/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || 'Credenciales inválidas');
        setLoading(false);
        return;
      }

      const user = data.data.user;

      // Check if user is ADMIN
      if (user.role !== 'ADMIN') {
        setError(`Acceso denegado. Tu rol es ${user.role}. Se requiere acceso de administrador.`);
        setLoading(false);
        return;
      }

      // Store tokens and user data
      localStorage.setItem('accessToken', data.data.tokens.accessToken);
      localStorage.setItem('refreshToken', data.data.tokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      // Redirect to admin dashboard
      router.push('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-md flex-col items-center justify-center gap-8 py-20">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
              <Lock size={24} className="text-white" />
            </div>
          </div>
          <div>
            <h1 className="font-serif text-4xl text-black tracking-tight">LUMA</h1>
            <p className="text-sm text-gray-500 mt-2 tracking-widest">PANEL ADMINISTRATIVO</p>
          </div>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-gray-200 bg-white w-full shadow-lg p-8 space-y-6">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@luma.ec"
                  disabled={loading}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none transition-colors disabled:opacity-50"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none transition-colors disabled:opacity-50"
                  required
                />
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex gap-3">
                <AlertCircle className="size-5 text-red-600 shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 font-medium flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                <>
                  Ingresar
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs text-gray-500 font-medium">Credenciales de Demostración</span>
            </div>
          </div>

          {/* Demo Credentials */}
          <div className="rounded-xl bg-gray-50 p-4 space-y-3">
            <p className="font-medium text-gray-900 text-sm">Cuenta Admin de Prueba:</p>
            <div className="space-y-2 text-sm bg-white rounded-lg p-3 font-mono text-gray-600 border border-gray-200">
              <p>Email: <span className="text-gray-900 font-semibold">admin@luma.ec</span></p>
              <p>Contraseña: <span className="text-gray-900 font-semibold">password123</span></p>
            </div>
          </div>

          {/* Back to Home */}
          <button
            type="button"
            className="w-full border-2 border-black text-black py-3 rounded-xl hover:bg-black hover:text-white transition-colors font-medium"
            onClick={() => router.push('/')}
            disabled={loading}
          >
            ← Volver al Portal
          </button>
        </div>

        {/* Footer */}
        <p className="text-xs text-gray-500 text-center max-w-xs leading-relaxed">
          Esta es un área segura de administrador. El acceso no autorizado está prohibido.
        </p>
      </div>
    </div>
  );
}
