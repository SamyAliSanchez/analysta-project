import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../lib/stores/auth.store";
import { useLogout } from "../../hooks/auth/use-auth";

export const DashboardLayout = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useLogout();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-space-900 via-space-950 to-black">
      <nav className="border-b border-white/10 bg-white/5 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/dashboard" className="text-xl font-semibold text-white">
            🚀 Trading Desk
          </Link>
          <div className="flex items-center gap-6">
            <span className="text-sm text-slate-300">{user?.displayName}</span>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-white/20 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
};

