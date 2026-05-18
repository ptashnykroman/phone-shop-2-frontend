"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { favoritesApi } from "@/features/favorites/api/favorites-api";
import { useAuthStore } from "@/features/auth/stores/auth-store";

export const favoriteQueryKeys = {
  all: ["favorites"] as const,
};

export function useFavoritesQuery() {
  const accessToken = useAuthStore((state) => state.accessToken);
  return useQuery({
    queryKey: favoriteQueryKeys.all,
    queryFn: favoritesApi.list,
    enabled: Boolean(accessToken),
  });
}

export function useAddFavoriteMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: favoritesApi.add,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: favoriteQueryKeys.all });
    },
  });
}

export function useRemoveFavoriteMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: favoritesApi.remove,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: favoriteQueryKeys.all });
    },
  });
}
