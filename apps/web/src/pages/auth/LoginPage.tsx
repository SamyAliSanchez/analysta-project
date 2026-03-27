import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLogin } from "../../hooks/auth/use-auth";

export const LoginPage = () => {
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await loginMutation.mutateAsync({ email, password });
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al iniciar sesión");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-space-900 via-space-950 to-black px-4 overflow-hidden">
      <div className="starfield" />

      {/* Decorative orbs */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-space-neon/10 blur-3xl animate-pulseSlow" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-space-magenta/10 blur-3xl animate-pulseSlow" style={{ animationDelay: '3s' }} />

      <div className="relative z-10 w-full max-w-md animate-slideUp">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-space-neon/20 to-space-magenta/20 shadow-neon">
            <span className="glow-pulse text-3xl">🚀</span>
          </div>
          <h1 className="text-3xl font-bold text-gradient">
            Trading Desk
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Mercado Intergaláctico de Activos Exóticos
          </p>
        </div>

        <div className="glass-card rounded-3xl p-8 shadow-card">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-semibold text-white">
              Iniciar Sesión
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Accede a tu Trading Desk Intergaláctico
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="animate-scaleIn rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 transition focus:border-space-neon/50 focus:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-space-neon/20"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 transition focus:border-space-neon/50 focus:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-space-neon/20"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full rounded-xl bg-gradient-to-r from-space-neon to-cyan-400 px-4 py-3.5 font-semibold text-space-950 shadow-neon transition hover:shadow-neon-lg disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loginMutation.isPending
                ? "Iniciando sesión..."
                : "Iniciar Sesión"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-400">
            ¿No tienes cuenta?{" "}
            <Link
              to="/register"
              className="font-medium text-space-neon transition hover:text-space-neon/80"
            >
              Regístrate
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
