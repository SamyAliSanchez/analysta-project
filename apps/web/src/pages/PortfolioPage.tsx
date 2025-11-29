import { useState } from "react";
import { usePositions } from "../hooks/positions/use-positions";
import { usePriceBySymbolOrId } from "../hooks/pricing/use-pricing";
import { usePositionSummary } from "../hooks/positions/use-positions";
import { ClosePositionButton } from "../components/positions/ClosePositionButton";
import type { Position } from "../lib/api/positions.api";

export const PortfolioPage = () => {
  const [activeTab, setActiveTab] = useState<"open" | "closed">("open");
  const { data: openPositions, isLoading: openLoading } = usePositions("open");
  const { data: closedPositions, isLoading: closedLoading } =
    usePositions("closed");
  const { data: summary } = usePositionSummary();

  const positions = activeTab === "open" ? openPositions : closedPositions;
  const isLoading = activeTab === "open" ? openLoading : closedLoading;

  const calculatePnL = (position: Position, currentPrice?: number): number => {
    if (position.status === "closed" && position.closePrice) {
      if (position.side === "buy") {
        return (position.closePrice - position.openPrice) * position.quantity;
      } else {
        return (position.openPrice - position.closePrice) * position.quantity;
      }
    }
    if (currentPrice && position.status === "open") {
      if (position.side === "buy") {
        return (currentPrice - position.openPrice) * position.quantity;
      } else {
        return (position.openPrice - currentPrice) * position.quantity;
      }
    }
    return 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white">Mi Cartera</h1>
          <p className="mt-2 text-slate-400">
            Gestiona tus posiciones abiertas y cerradas
          </p>
        </div>
        {summary && (
          <div className="text-right">
            <p className="text-sm text-slate-400">PnL Total</p>
            <p
              className={`text-2xl font-bold ${
                summary.totalPnL >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {summary.totalPnL >= 0 ? "+" : ""}${summary.totalPnL.toFixed(2)}
            </p>
          </div>
        )}
      </div>

      <div className="flex gap-2 border-b border-white/10">
        <button
          onClick={() => setActiveTab("open")}
          className={`px-4 py-2 text-sm font-medium transition ${
            activeTab === "open"
              ? "border-b-2 border-space-neon text-space-neon"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Abiertas ({summary?.openPositions || 0})
        </button>
        <button
          onClick={() => setActiveTab("closed")}
          className={`px-4 py-2 text-sm font-medium transition ${
            activeTab === "closed"
              ? "border-b-2 border-space-neon text-space-neon"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Cerradas ({summary?.closedPositions || 0})
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-slate-400">Cargando posiciones...</p>
        </div>
      ) : !positions || positions.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
          <p className="text-slate-400">
            No tienes posiciones{" "}
            {activeTab === "open" ? "abiertas" : "cerradas"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {positions.map((position) => {
            const assetId =
              typeof position.assetId === "string"
                ? position.assetId
                : position.assetId._id;
            const assetName =
              typeof position.assetId === "string"
                ? "Loading..."
                : position.assetId.name;
            const assetSymbol =
              typeof position.assetId === "string"
                ? "---"
                : position.assetId.symbol;

            return (
              <PositionCard
                key={position._id}
                position={position}
                assetId={assetId}
                assetName={assetName}
                assetSymbol={assetSymbol}
                calculatePnL={calculatePnL}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

interface PositionCardProps {
  position: Position;
  assetId: string;
  assetName: string;
  assetSymbol: string;
  calculatePnL: (pos: Position, price?: number) => number;
}

const PositionCard = ({
  position,
  assetId,
  assetName,
  assetSymbol,
  calculatePnL,
}: PositionCardProps) => {
  const { data: currentPrice } = usePriceBySymbolOrId(assetId);
  const pnl = calculatePnL(position, currentPrice?.price);

  const displayPrice =
    position.status === "closed" ? position.closePrice : currentPrice?.price;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-white">{assetName}</h3>
            <span className="rounded-full border border-white/20 px-3 py-1 text-xs uppercase text-slate-300">
              {assetSymbol}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                position.side === "buy"
                  ? "bg-green-500/20 text-green-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {position.side.toUpperCase()}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div>
              <p className="text-xs text-slate-400">Cantidad</p>
              <p className="mt-1 font-semibold text-white">
                {position.quantity}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Precio Apertura</p>
              <p className="mt-1 font-semibold text-white">
                ${position.openPrice.toFixed(2)}
              </p>
            </div>
            {displayPrice && (
              <div>
                <p className="text-xs text-slate-400">
                  {position.status === "closed"
                    ? "Precio Cierre"
                    : "Precio Actual"}
                </p>
                <p className="mt-1 font-semibold text-white">
                  ${displayPrice.toFixed(2)}
                </p>
              </div>
            )}
            <div>
              <p className="text-xs text-slate-400">PnL</p>
              <p
                className={`mt-1 font-semibold ${
                  pnl >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {pnl >= 0 ? "+" : ""}${pnl.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="mt-4 text-xs text-slate-500">
            Abierta: {new Date(position.openDate).toLocaleString()}
            {position.closeDate &&
              ` • Cerrada: ${new Date(position.closeDate).toLocaleString()}`}
          </div>
        </div>

        {position.status === "open" && (
          <div className="ml-4">
            <ClosePositionButton position={position} />
          </div>
        )}
      </div>
    </div>
  );
};
