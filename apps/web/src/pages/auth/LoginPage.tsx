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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-space-900 via-space-950 to-black px-4">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-card backdrop-blur-lg">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-semibold text-white">
              Iniciar Sesión
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Accede a tu Trading Desk Intergaláctico
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-400">
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
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 focus:border-space-neon focus:outline-none focus:ring-2 focus:ring-space-neon/50"
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
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 focus:border-space-neon focus:outline-none focus:ring-2 focus:ring-space-neon/50"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full rounded-lg bg-space-neon px-4 py-3 font-semibold text-space-900 transition hover:bg-space-neon/90 disabled:cursor-not-allowed disabled:opacity-50"
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
              className="font-medium text-space-neon hover:underline"
            >
              Regístrate
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
