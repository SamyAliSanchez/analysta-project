import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  positionsApi,
  type OpenPositionDto,
  type ClosePositionDto,
} from "../../lib/api/positions.api";

export const usePositions = (status?: "open" | "closed") => {
  return useQuery({
    queryKey: ["positions", status],
    queryFn: () => positionsApi.getAll(status),
  });
};

export const usePosition = (id: string) => {
  return useQuery({
    queryKey: ["position", id],
    queryFn: () => positionsApi.getById(id),
    enabled: !!id,
  });
};

export const usePositionSummary = () => {
  return useQuery({
    queryKey: ["positions", "summary"],
    queryFn: () => positionsApi.getSummary(),
  });
};

export const useOpenPosition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: OpenPositionDto) => positionsApi.open(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["positions"] });
      queryClient.invalidateQueries({ queryKey: ["positions", "summary"] });
    },
  });
};

export const useClosePosition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ClosePositionDto }) =>
      positionsApi.close(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["positions"] });
      queryClient.invalidateQueries({ queryKey: ["positions", "summary"] });
    },
  });
};
