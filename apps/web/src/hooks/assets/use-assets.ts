import { useQuery } from "@tanstack/react-query";
import { assetsApi, type FilterAssetsDto } from "../../lib/api/assets.api";

export const useAssets = (filters?: FilterAssetsDto) => {
  return useQuery({
    queryKey: ["assets", filters],
    queryFn: () => assetsApi.getAll(filters),
  });
};

export const useAsset = (id: string) => {
  return useQuery({
    queryKey: ["asset", id],
    queryFn: () => assetsApi.getById(id),
    enabled: !!id,
  });
};
