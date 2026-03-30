import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAsset } from "../hooks/assets/use-assets";
import { usePriceBySymbolOrId } from "../hooks/pricing/use-pricing";
import { OpenPositionModal } from "../components/positions/OpenPositionModal";

const CATEGORY_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  equity: { bg: "bg-blue-500/15", text: "text-blue-400", border: "border-blue-500/30" },
  bond: { bg: "bg-emerald-500/15", text: "text-emerald-400", border: "border-emerald-500/30" },
  derivative: { bg: "bg-amber-500/15", text: "text-amber-400", border: "border-amber-500/30" },
  "crypto-like": { bg: "bg-purple-500/15", text: "text-purple-400", border: "border-purple-500/30" },
  exotic: { bg: "bg-pink-500/15", text: "text-pink-400", border: "border-pink-500/30" },
};

const getCategoryStyle = (category: string) =>
  CATEGORY_STYLES[category] || { bg: "bg-white/10", text: "text-slate-300", border: "border-white/20" };

const getVolatilityColor = (v: number) =>
  v < 0.3 ? "from-green-400 to-green-500" : v < 0.6 ? "from-yellow-400 to-amber-500" : "from-red-400 to-red-500";

export const AssetDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: asset, isLoading: assetLoading } = useAsset(id || "");
  const { data: price, isLoading: priceLoading } = usePriceBySymbolOrId(
    id || ""
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (assetLoading || priceLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 animate-fadeIn">
        <div className="h-10 w-10 animate-spinSlow rounded-full border-2 border-space-neon/30 border-t-space-neon" />
        <p className="text-slate-400">Cargando activo...</p>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fadeIn">
        <p className="text-xl text-slate-400">Activo no encontrado</p>
        <Link to="/dashboard" className="mt-4 text-space-neon transition hover:text-space-neon/80">
          Volver al Dashboard
        </Link>
      </div>
    );
  }

  const catStyle = getCategoryStyle(asset.category);

  return (
    <div className="space-y-6 animate-slideUp">
      <Link
        to="/dashboard"
        className="group inline-flex items-center gap-1 text-sm text-slate-400 transition hover:text-space-neon"
      >
        <span className="transition group-hover:-translate-x-1">&larr;</span>
        Volver al Dashboard
      </Link>

      <div className="glass-card rounded-3xl p-8 shadow-card">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">{asset.name}</h1>
            <p className="mt-2 font-mono text-lg text-slate-400">{asset.symbol}</p>
          </div>
          <span className={`rounded-full border px-4 py-2 text-sm font-medium uppercase ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}>
            {asset.category}
          </span>
        </div>

        {price && (
          <div className="mb-6 relative overflow-hidden rounded-2xl border border-space-neon/20 bg-gradient-to-br from-space-neon/10 to-space-neon/5 p-6">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-space-neon/10 blur-3xl" />
            <p className="text-sm font-medium uppercase tracking-wider text-space-neon">
              Precio Actual
            </p>
            <p className="mt-2 font-mono text-5xl font-bold text-white">
              ${price.price.toFixed(2)}
            </p>
            <p className="mt-2 text-xs text-slate-400">
              Actualizado: {new Date(price.timestamp).toLocaleString()}
            </p>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <div className="glass-card rounded-2xl p-6">
            <p className="text-sm font-medium uppercase tracking-wider text-slate-500">
              Volatilidad
            </p>
            <p className="mt-2 text-3xl font-bold text-white">
              {(asset.volatility * 100).toFixed(1)}%
            </p>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${getVolatilityColor(asset.volatility)} transition-all duration-500`}
                style={{ width: `${asset.volatility * 100}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-slate-400">
              {asset.volatility < 0.3
                ? "Bajo riesgo"
                : asset.volatility < 0.6
                  ? "Riesgo moderado"
                  : "Alto riesgo"}
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <p className="text-sm font-medium uppercase tracking-wider text-slate-500">
              Categoría
            </p>
            <p className="mt-2 text-xl font-semibold capitalize text-white">
              {asset.category.replace("-", " ")}
            </p>
          </div>
        </div>

        <div className="mt-6 glass-card rounded-2xl p-6">
          <p className="mb-4 text-sm font-medium uppercase tracking-wider text-slate-500">
            Descripción
          </p>
          <p className="text-slate-300 leading-relaxed">{asset.description}</p>
        </div>

        <div className="mt-6">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full rounded-xl bg-gradient-to-r from-space-neon to-cyan-400 px-6 py-4 text-lg font-semibold text-space-950 shadow-neon transition hover:shadow-neon-lg"
          >
            Abrir Posición
          </button>
        </div>
      </div>

      {asset && (
        <OpenPositionModal
          asset={asset}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};
