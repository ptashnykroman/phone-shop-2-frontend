"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { explanationsApi } from "@/features/explanations/api/explanations-api";
import type { CharacteristicExplanationPayload } from "@/shared/api/api-types";

export const explanationQueryKeys = {
  all: ["characteristic-explanations"] as const,
};

export function useCharacteristicExplanationsQuery() {
  return useQuery({
    queryKey: explanationQueryKeys.all,
    queryFn: explanationsApi.list,
  });
}

export function useCreateExplanationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CharacteristicExplanationPayload) =>
      explanationsApi.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: explanationQueryKeys.all });
    },
  });
}

export function useUpdateExplanationMutation(explanationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<CharacteristicExplanationPayload>) =>
      explanationsApi.update(explanationId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: explanationQueryKeys.all });
    },
  });
}

export function useDeleteExplanationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (explanationId: string) => explanationsApi.remove(explanationId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: explanationQueryKeys.all });
    },
  });
}
