import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAsset } from "../hooks/assets/use-assets";
import { usePriceBySymbolOrId } from "../hooks/pricing/use-pricing";
import { OpenPositionModal } from "../components/positions/OpenPositionModal";

export const AssetDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: asset, isLoading: assetLoading } = useAsset(id || "");
  const { data: price, isLoading: priceLoading } = usePriceBySymbolOrId(
    id || ""
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (assetLoading || priceLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-slate-400">Cargando...</p>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-xl text-slate-400">Activo no encontrado</p>
        <Link to="/dashboard" className="mt-4 text-space-neon hover:underline">
          Volver al Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        to="/dashboard"
        className="inline-flex items-center text-sm text-slate-400 hover:text-space-neon"
      >
        ← Volver al Dashboard
      </Link>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-card">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-white">{asset.name}</h1>
            <p className="mt-2 text-lg text-slate-400">{asset.symbol}</p>
          </div>
          <span className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm uppercase text-slate-300">
            {asset.category}
          </span>
        </div>

        {price && (
          <div className="mb-6 rounded-2xl border border-space-neon/30 bg-space-neon/10 p-6">
            <p className="text-sm uppercase tracking-wider text-space-neon">
              Precio Actual
            </p>
            <p className="mt-2 text-5xl font-bold text-white">
              ${price.price.toFixed(2)}
            </p>
            <p className="mt-2 text-xs text-slate-400">
              Actualizado: {new Date(price.timestamp).toLocaleString()}
            </p>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-black/30 p-6">
            <p className="text-sm uppercase tracking-wider text-slate-500">
              Volatilidad
            </p>
            <p className="mt-2 text-3xl font-semibold text-white">
              {(asset.volatility * 100).toFixed(1)}%
            </p>
            <p className="mt-2 text-xs text-slate-400">
              {asset.volatility < 0.3
                ? "Bajo riesgo"
                : asset.volatility < 0.6
                  ? "Riesgo moderado"
                  : "Alto riesgo"}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/30 p-6">
            <p className="text-sm uppercase tracking-wider text-slate-500">
              Categoría
            </p>
            <p className="mt-2 text-xl font-semibold capitalize text-white">
              {asset.category.replace("-", " ")}
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-6">
          <p className="mb-4 text-sm uppercase tracking-wider text-slate-500">
            Descripción
          </p>
          <p className="text-slate-300 leading-relaxed">{asset.description}</p>
        </div>

        <div className="mt-6">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full rounded-lg bg-space-neon px-6 py-3 font-semibold text-space-900 transition hover:bg-space-neon/90"
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
