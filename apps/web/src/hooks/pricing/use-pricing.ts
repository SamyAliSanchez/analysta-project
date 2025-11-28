import { useQuery } from "@tanstack/react-query";
import { pricingApi } from "../../lib/api/pricing.api";

export const usePricing = () => {
  return useQuery({
    queryKey: ["pricing", "all"],
    queryFn: () => pricingApi.getAll(),
    refetchInterval: 3000,
  });
};

export const usePriceBySymbolOrId = (symbolOrId: string) => {
  return useQuery({
    queryKey: ["pricing", symbolOrId],
    queryFn: () => pricingApi.getBySymbolOrId(symbolOrId),
    enabled: !!symbolOrId,
    refetchInterval: 3000,
  });
};
