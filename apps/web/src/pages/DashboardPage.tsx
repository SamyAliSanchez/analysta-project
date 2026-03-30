import { Link } from "react-router-dom";
import { useAssets } from "../hooks/assets/use-assets";
import { usePricing } from "../hooks/pricing/use-pricing";
import { usePositionSummary } from "../hooks/positions/use-positions";

const CATEGORY_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  equity: { bg: "bg-blue-500/15", text: "text-blue-400", border: "border-blue-500/30" },
  bond: { bg: "bg-emerald-500/15", text: "text-emerald-400", border: "border-emerald-500/30" },
  derivative: { bg: "bg-amber-500/15", text: "text-amber-400", border: "border-amber-500/30" },
  "crypto-like": { bg: "bg-purple-500/15", text: "text-purple-400", border: "border-purple-500/30" },
  exotic: { bg: "bg-pink-500/15", text: "text-pink-400", border: "border-pink-500/30" },
};

const getCategoryStyle = (category: string) =>
  CATEGORY_STYLES[category] || { bg: "bg-white/10", text: "text-slate-300", border: "border-white/20" };

export const DashboardPage = () => {
  const { data: assets, isLoading: assetsLoading } = useAssets();
  const { data: prices, isLoading: pricesLoading } = usePricing();
  const { data: summary } = usePositionSummary();

  const getPriceForAsset = (assetId: string) => {
    return prices?.find((p) => p.assetId === assetId);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="mt-2 text-slate-400">
            Bienvenido a tu Trading Desk Intergaláctico
          </p>
        </div>
      </div>

      {summary && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-slideUp">
          <div className="group glass-card relative overflow-hidden rounded-2xl p-6 transition hover:border-green-500/30">
            <div className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full bg-green-500/10 blur-2xl transition group-hover:bg-green-500/20" />
            <p className="text-sm font-medium text-slate-400">PnL Total</p>
            <p
              className={`mt-2 text-2xl font-bold ${
                summary.totalPnL >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {summary.totalPnL >= 0 ? "+" : ""}${summary.totalPnL.toFixed(2)}
            </p>
          </div>
          <div className="group glass-card relative overflow-hidden rounded-2xl p-6 transition hover:border-space-neon/30">
            <div className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full bg-space-neon/10 blur-2xl transition group-hover:bg-space-neon/20" />
            <p className="text-sm font-medium text-slate-400">Posiciones Abiertas</p>
            <p className="mt-2 text-2xl font-bold text-white">
              {summary.openPositions}
            </p>
          </div>
          <div className="group glass-card relative overflow-hidden rounded-2xl p-6 transition hover:border-space-magenta/30">
            <div className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full bg-space-magenta/10 blur-2xl transition group-hover:bg-space-magenta/20" />
            <p className="text-sm font-medium text-slate-400">Posiciones Cerradas</p>
            <p className="mt-2 text-2xl font-bold text-white">
              {summary.closedPositions}
            </p>
          </div>
          <div className="group glass-card relative overflow-hidden rounded-2xl p-6 transition hover:border-purple-500/30">
            <div className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full bg-purple-500/10 blur-2xl transition group-hover:bg-purple-500/20" />
            <p className="text-sm font-medium text-slate-400">Activos Disponibles</p>
            <p className="mt-2 text-2xl font-bold text-white">
              {assets?.length || 0}
            </p>
          </div>
        </div>
      )}

      <div>
        <h2 className="mb-4 text-lg font-semibold text-white">Activos del Mercado</h2>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {assetsLoading || pricesLoading ? (
            <>
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass-card rounded-2xl p-6">
                  <div className="skeleton mb-3 h-5 w-2/3" />
                  <div className="skeleton mb-4 h-4 w-1/3" />
                  <div className="skeleton h-8 w-1/2" />
                </div>
              ))}
            </>
          ) : (
            assets?.map((asset, index) => {
              const price = getPriceForAsset(asset._id);
              const catStyle = getCategoryStyle(asset.category);
              return (
                <Link
                  key={asset._id}
                  to={`/assets/${asset._id}`}
                  className="group glass-card relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:border-space-neon/40 hover:shadow-neon animate-slideUp"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-space-neon/5 blur-2xl transition-all duration-300 group-hover:bg-space-neon/15" />

                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white transition group-hover:text-space-neon">
                        {asset.name}
                      </h3>
                      <p className="mt-1 font-mono text-sm text-slate-400">
                        {asset.symbol}
                      </p>
                    </div>
                    <span className={`rounded-full border px-3 py-1 text-xs font-medium uppercase ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}>
                      {asset.category}
                    </span>
                  </div>
                  {price && (
                    <div className="mt-4 flex items-end justify-between">
                      <div>
                        <p className="font-mono text-2xl font-bold text-space-neon">
                          ${price.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500">Volatilidad</p>
                        <div className="mt-1 flex items-center gap-2">
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/10">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-400"
                              style={{ width: `${asset.volatility * 100}%` }}
                            />
                          </div>
                          <span className="font-mono text-xs text-slate-400">
                            {(asset.volatility * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
