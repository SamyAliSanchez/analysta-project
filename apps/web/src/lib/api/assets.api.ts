import apiClient from "./client";

export interface Asset {
  _id: string;
  symbol: string;
  name: string;
  category: "equity" | "bond" | "derivative" | "crypto-like" | "exotic";
  volatility: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface FilterAssetsDto {
  category?: Asset["category"];
  search?: string;
}

export const assetsApi = {
  getAll: async (filters?: FilterAssetsDto): Promise<Asset[]> => {
    const params = new URLSearchParams();
    if (filters?.category) params.append("category", filters.category);
    if (filters?.search) params.append("search", filters.search);

    const response = await apiClient.get<Asset[]>("/assets", { params });
    return response.data;
  },

  getById: async (id: string): Promise<Asset> => {
    const response = await apiClient.get<Asset>(`/assets/${id}`);
    return response.data;
  },
};
