import { useState } from "react";
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
  const [quantity, setQuantity] = useState("");
  const openPositionMutation = useOpenPosition();
  const { data: price } = usePriceBySymbolOrId(asset._id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!price) return;

    try {
      await openPositionMutation.mutateAsync({
        assetId: asset._id,
        side,
        quantity: parseFloat(quantity),
      });
      onClose();
      setQuantity("");
    } catch (error) {
      console.error("Error opening position:", error);
    }
  };

  if (!isOpen) return null;

  const totalValue = price && quantity ? price.price * parseFloat(quantity) : 0;

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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Tipo de Operación
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSide("buy")}
                className={`flex-1 rounded-lg px-4 py-3 font-semibold transition ${
                  side === "buy"
                    ? "bg-green-500/20 text-green-400 border border-green-500/50"
                    : "bg-white/5 text-slate-400 border border-white/10"
                }`}
              >
                Comprar
              </button>
              <button
                type="button"
                onClick={() => setSide("sell")}
                className={`flex-1 rounded-lg px-4 py-3 font-semibold transition ${
                  side === "sell"
                    ? "bg-red-500/20 text-red-400 border border-red-500/50"
                    : "bg-white/5 text-slate-400 border border-white/10"
                }`}
              >
                Vender
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="quantity"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Cantidad
            </label>
            <input
              id="quantity"
              type="number"
              step="0.01"
              min="0.01"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 focus:border-space-neon focus:outline-none focus:ring-2 focus:ring-space-neon/50"
              placeholder="0.00"
            />
          </div>

          {quantity && price && (
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <div className="flex justify-between text-sm text-slate-400">
                <span>Valor Total</span>
                <span className="text-lg font-semibold text-white">
                  ${totalValue.toFixed(2)}
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
              disabled={openPositionMutation.isPending || !price || !quantity}
              className="flex-1 rounded-lg bg-space-neon px-4 py-3 font-semibold text-space-900 transition hover:bg-space-neon/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {openPositionMutation.isPending
                ? "Abriendo..."
                : "Abrir Posición"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
