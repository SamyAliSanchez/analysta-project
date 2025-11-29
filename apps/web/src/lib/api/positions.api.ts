import apiClient from "./client";

export interface Position {
  _id: string;
  userId: string;
  assetId:
    | string
    | {
        _id: string;
        symbol: string;
        name: string;
        category: string;
      };
  side: "buy" | "sell";
  quantity: number;
  openPrice: number;
  openDate: string;
  status: "open" | "closed";
  closePrice?: number;
  closeDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OpenPositionDto {
  assetId: string;
  side: "buy" | "sell";
  quantity: number;
}

export interface ClosePositionDto {
  closePrice: number;
}

export interface PositionSummary {
  totalPnL: number;
  pnLByAsset: Record<string, number>;
  openPositions: number;
  closedPositions: number;
}

export const positionsApi = {
  getAll: async (status?: "open" | "closed"): Promise<Position[]> => {
    const params = new URLSearchParams();
    if (status) params.append("status", status);

    const response = await apiClient.get<Position[]>("/positions", { params });
    return response.data;
  },

  getById: async (id: string): Promise<Position> => {
    const response = await apiClient.get<Position>(`/positions/${id}`);
    return response.data;
  },

  open: async (data: OpenPositionDto): Promise<Position> => {
    const response = await apiClient.post<Position>("/positions", data);
    return response.data;
  },

  close: async (id: string, data: ClosePositionDto): Promise<Position> => {
    const response = await apiClient.post<Position>(
      `/positions/${id}/close`,
      data
    );
    return response.data;
  },

  getSummary: async (): Promise<PositionSummary> => {
    const response = await apiClient.get<PositionSummary>("/positions/summary");
    return response.data;
  },
};
