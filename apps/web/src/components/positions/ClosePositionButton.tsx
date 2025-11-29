import { useState } from "react";
import { useClosePosition } from "../../hooks/positions/use-positions";
import { usePriceBySymbolOrId } from "../../hooks/pricing/use-pricing";
import type { Position } from "../../lib/api/positions.api";

interface ClosePositionButtonProps {
  position: Position;
}

export const ClosePositionButton = ({ position }: ClosePositionButtonProps) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const closePositionMutation = useClosePosition();

  const assetId =
    typeof position.assetId === "string"
      ? position.assetId
      : position.assetId._id;

  const { data: currentPrice } = usePriceBySymbolOrId(assetId);

  const handleClose = async () => {
    if (!currentPrice || !isConfirming) {
      setIsConfirming(true);
      return;
    }

    try {
      await closePositionMutation.mutateAsync({
        id: position._id,
        data: { closePrice: currentPrice.price },
      });
      setIsConfirming(false);
    } catch (error) {
      console.error("Error closing position:", error);
      setIsConfirming(false);
    }
  };

  const currentPnL = currentPrice
    ? position.side === "buy"
      ? (currentPrice.price - position.openPrice) * position.quantity
      : (position.openPrice - currentPrice.price) * position.quantity
    : 0;

  return (
    <div className="flex items-center gap-3">
      {currentPrice && (
        <div className="text-right">
          <p className="text-xs text-slate-400">PnL Estimado</p>
          <p
            className={`text-sm font-semibold ${
              currentPnL >= 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            {currentPnL >= 0 ? "+" : ""}${currentPnL.toFixed(2)}
          </p>
        </div>
      )}
      <button
        onClick={handleClose}
        disabled={closePositionMutation.isPending || !currentPrice}
        className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
          isConfirming
            ? "bg-red-500 text-white hover:bg-red-600"
            : "border border-white/20 text-slate-300 hover:bg-white/10"
        } disabled:cursor-not-allowed disabled:opacity-50`}
      >
        {closePositionMutation.isPending
          ? "Cerrando..."
          : isConfirming
            ? "Confirmar Cierre"
            : "Cerrar Posición"}
      </button>
      {isConfirming && (
        <button
          onClick={() => setIsConfirming(false)}
          className="rounded-lg border border-white/20 px-4 py-2 text-sm text-slate-300 hover:bg-white/10"
        >
          Cancelar
        </button>
      )}
    </div>
  );
};
