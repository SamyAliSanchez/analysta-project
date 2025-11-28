import apiClient from "./client";

export interface PriceTick {
  assetId: string;
  symbol: string;
  name: string;
  price: number;
  timestamp: string;
}

export const pricingApi = {
  getAll: async (): Promise<PriceTick[]> => {
    const response = await apiClient.get<PriceTick[]>("/pricing");
    return response.data;
  },

  getBySymbolOrId: async (symbolOrId: string): Promise<PriceTick> => {
    const response = await apiClient.get<PriceTick>(`/pricing/${symbolOrId}`);
    return response.data;
  },
};
