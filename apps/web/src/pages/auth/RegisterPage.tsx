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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-space-900 via-space-950 to-black px-4">
      <div className="max-w-md">
        <div className="rounded-3xl bg-white/5 p-8 shadow-card backdrop-blur-lg">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-semibold text-white">Crear Cuenta</h1>
            <p className="mt-2 text-sm text-slate-400">
              Únete al Mercado Intergaláctico
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
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 focus:border-space-neon focus:outline-none focus:ring-2 focus:ring-space-neon/50"
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
                minLength={6}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 focus:border-space-neon focus:outline-none focus:ring-2 focus:ring-space-neon/50"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="rounded-lg bg-space-neon px-4 py-3 font-semibold text-space-900 transition hover:bg-space-neon/90 disabled:cursor-not-allowed disabled:opacity-50"
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
              className="font-medium text-space-neon hover:underline"
            >
              Inicia sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
