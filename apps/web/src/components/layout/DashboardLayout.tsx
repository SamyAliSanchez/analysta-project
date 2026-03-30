import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../lib/stores/auth.store";
import { useLogout } from "../../hooks/auth/use-auth";

export const DashboardLayout = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useLogout();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-space-900 via-space-950 to-black">
      <div className="starfield" />

      <nav className="sticky top-0 z-40 border-b border-white/10 bg-space-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            to="/dashboard"
            className="group flex items-center gap-2 text-xl font-bold text-white transition"
          >
            <span className="glow-pulse text-2xl">🚀</span>
            <span className="text-gradient">Trading Desk</span>
          </Link>

          <div className="flex items-center gap-1">
            <Link
              to="/dashboard"
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                isActive("/dashboard")
                  ? "bg-space-neon/10 text-space-neon"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/dashboard/portfolio"
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                isActive("/dashboard/portfolio")
                  ? "bg-space-neon/10 text-space-neon"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              Mi Cartera
            </Link>

            <div className="mx-3 h-6 w-px bg-white/10" />

            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-space-neon/30 to-space-magenta/30 text-xs font-bold text-white">
                {user?.displayName?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <span className="hidden text-sm font-medium text-slate-300 sm:inline">
                {user?.displayName}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="ml-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-400 transition hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400"
            >
              Salir
            </button>
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-space-neon/30 to-transparent" />
      </nav>

      <main className="relative z-10 mx-auto max-w-7xl px-6 py-8 animate-fadeIn">
        <Outlet />
      </main>
    </div>
  );
};
