"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reviewsApi } from "@/features/reviews/api/reviews-api";
import type {
  CreateReviewRequest,
  ModerateReviewRequest,
} from "@/shared/api/api-types";

export const reviewQueryKeys = {
  list: (productId: string) => ["reviews", productId] as const,
};

export function useProductReviewsQuery(productId: string) {
  return useQuery({
    queryKey: reviewQueryKeys.list(productId),
    queryFn: () => reviewsApi.list(productId),
    enabled: Boolean(productId),
  });
}

export function useCreateReviewMutation(productId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateReviewRequest) =>
      reviewsApi.create(productId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: reviewQueryKeys.list(productId),
      });
    },
  });
}

export function useModerateReviewMutation(productId: string, reviewId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ModerateReviewRequest) =>
      reviewsApi.moderate(reviewId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: reviewQueryKeys.list(productId),
      });
    },
  });
}
