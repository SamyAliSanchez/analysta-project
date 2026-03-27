import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegister } from "../../hooks/auth/use-auth";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const registerMutation = useRegister();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {
      await registerMutation.mutateAsync({ email, password, displayName });
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al registrar usuario");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-space-900 via-space-950 to-black px-4 overflow-hidden">
      <div className="starfield" />

      {/* Decorative orbs */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-space-magenta/10 blur-3xl animate-pulseSlow" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-space-neon/10 blur-3xl animate-pulseSlow" style={{ animationDelay: '3s' }} />

      <div className="relative z-10 w-full max-w-md animate-slideUp">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-space-magenta/20 to-space-neon/20 shadow-magenta">
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
            <h2 className="text-2xl font-semibold text-white">Crear Cuenta</h2>
            <p className="mt-2 text-sm text-slate-400">
              Únete al Mercado Intergaláctico
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
                htmlFor="displayName"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Nombre
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                minLength={2}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 transition focus:border-space-neon/50 focus:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-space-neon/20"
                placeholder="Tu nombre"
              />
            </div>

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
                minLength={6}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 transition focus:border-space-neon/50 focus:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-space-neon/20"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full rounded-xl bg-gradient-to-r from-space-magenta to-space-neon px-4 py-3.5 font-semibold text-space-950 shadow-magenta transition hover:shadow-neon-lg disabled:cursor-not-allowed disabled:opacity-50"
            >
              {registerMutation.isPending
                ? "Creando cuenta..."
                : "Crear Cuenta"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-400">
            ¿Ya tienes cuenta?{" "}
            <Link
              to="/login"
              className="font-medium text-space-neon transition hover:text-space-neon/80"
            >
              Inicia sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
