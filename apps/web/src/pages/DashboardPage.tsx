import { Link } from "react-router-dom";
import { useAssets } from "../hooks/assets/use-assets";
import { usePricing } from "../hooks/pricing/use-pricing";

export const DashboardPage = () => {
  const { data: assets, isLoading: assetsLoading } = useAssets();
  const { data: prices, isLoading: pricesLoading } = usePricing();

  const getPriceForAsset = (assetId: string) => {
    return prices?.find((p) => p.assetId === assetId);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-white">Dashboard</h1>
        <p className="mt-2 text-slate-400">
          Bienvenido a tu Trading Desk Intergaláctico
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {assetsLoading || pricesLoading ? (
          <div className="col-span-full text-center text-slate-400">
            Cargando...
          </div>
        ) : (
          assets?.map((asset) => {
            const price = getPriceForAsset(asset._id);
            return (
              <Link
                key={asset._id}
                to={`/assets/${asset._id}`}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-space-neon/50 hover:bg-white/10"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {asset.name}
                    </h3>
                    <p className="mt-1 text-sm text-slate-400">
                      {asset.symbol}
                    </p>
                  </div>
                  <span className="rounded-full border border-white/20 px-3 py-1 text-xs uppercase text-slate-300">
                    {asset.category}
                  </span>
                </div>
                {price && (
                  <div className="mt-4">
                    <p className="text-2xl font-bold text-space-neon">
                      ${price.price.toFixed(2)}
                    </p>
                    <p className="text-xs text-slate-500">
                      Volatilidad: {(asset.volatility * 100).toFixed(0)}%
                    </p>
                  </div>
                )}
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
};
