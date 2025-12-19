import { useEffect, useState } from "react";
import { useOpenPosition } from "../../hooks/positions/use-positions";
import { usePriceBySymbolOrId } from "../../hooks/pricing/use-pricing";
import type { Asset } from "../../lib/api/assets.api";

interface OpenPositionModalProps {
  asset: Asset;
  isOpen: boolean;
  onClose: () => void;
}

export const OpenPositionModal = ({
  asset,
  isOpen,
  onClose,
}: OpenPositionModalProps) => {
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [quantityBuy, setQuantityBuy] = useState(0);
  const [quantitySell, setQuantitySell] = useState(0);
  const openPositionMutation = useOpenPosition();
  const { data: price } = usePriceBySymbolOrId(asset._id);

  useEffect(() => {
    if (quantityBuy > 0) {
      setSide("buy");
    }
  }, [quantityBuy]);

  useEffect(() => {
    if (quantitySell > 0) {
      setSide("sell");
    }
  }, [quantitySell]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!price) return;

    const quantity = side === "buy" ? quantityBuy : quantitySell;
    if (!quantity || quantity <= 0) return;

    try {
      await openPositionMutation.mutateAsync({
        assetId: asset._id,
        side,
        quantity: quantity,
      });
      onClose();
      setQuantityBuy(0);
      setQuantitySell(0);
      setSide("buy");
    } catch (error) {
      console.error("Error opening position:", error);
    }
  };

  if (!isOpen) return null;

  const totalValueBuy = price && quantityBuy ? price.price * quantityBuy : 0;
  const totalValueSell = price && quantitySell ? price.price * quantitySell : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-space-900 p-6 shadow-card">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">Abrir Posición</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="mb-6 rounded-2xl border border-white/10 bg-black/30 p-4">
          <p className="text-sm text-slate-400">{asset.name}</p>
          <p className="text-lg font-semibold text-white">{asset.symbol}</p>
          {price && (
            <p className="mt-1 text-2xl font-bold text-space-neon">
              ${price.price.toFixed(2)}
            </p>
          )}
        </div>
        <div className="flex gap-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="quantityBuy"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Cantidad a comprar
              </label>
              <input
                id="quantityBuy"
                type="number"
                step="0.01"
                min="0.01"
                value={quantityBuy}
                onChange={(e) => setQuantityBuy(Number(e.target.value))}
                required
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 focus:border-space-neon focus:outline-none focus:ring-2 focus:ring-space-neon/50"
                placeholder="0.00"
              />
            </div>

            {quantityBuy > 0 && price && (
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <div className="flex justify-between text-sm text-slate-400">
                  <span>Valor Total</span>
                  <span className="text-lg font-semibold text-white">
                    ${totalValueBuy.toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-lg border border-white/20 px-4 py-3 text-slate-300 transition hover:bg-white/10"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={
                  openPositionMutation.isPending ||
                  !price ||
                  !quantityBuy ||
                  quantityBuy <= 0 ||
                  side !== "buy"
                }
                className="flex-1 rounded-lg bg-green-600 px-4 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {openPositionMutation.isPending ? "Comprando..." : "Comprar"}
              </button>
            </div>
          </form>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="quantitySell"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Cantidad a vender
              </label>
              <input
                id="quantitySell"
                type="number"
                step="0.01"
                min="0.01"
                value={quantitySell || ""}
                onChange={(e) => setQuantitySell(Number(e.target.value))}
                required
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 focus:border-space-neon focus:outline-none focus:ring-2 focus:ring-space-neon/50"
                placeholder="0.00"
              />
            </div>

            {quantitySell > 0 && price && (
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <div className="flex justify-between text-sm text-slate-400">
                  <span>Valor Total</span>
                  <span className="text-lg font-semibold text-white">
                    ${totalValueSell.toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-lg border border-white/20 px-4 py-3 text-slate-300 transition hover:bg-white/10"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={
                  openPositionMutation.isPending ||
                  !price ||
                  !quantitySell ||
                  quantitySell <= 0 ||
                  side !== "sell"
                }
                className="flex-1 rounded-lg bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {openPositionMutation.isPending ? "Vendiendo..." : "Vender"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
