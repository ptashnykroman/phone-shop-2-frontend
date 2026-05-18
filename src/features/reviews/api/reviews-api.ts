import { api } from "@/shared/api/axios-instance";
import type {
  CreateReviewRequest,
  ModerateReviewRequest,
  ProductPublicReview,
} from "@/shared/api/api-types";

export const reviewsApi = {
  async list(productId: string) {
    const { data } = await api.get<ProductPublicReview[]>(
      `/products/${productId}/reviews`,
    );
    return data;
  },
  async create(productId: string, payload: CreateReviewRequest) {
    const { data } = await api.post(`/products/${productId}/reviews`, payload);
    return data;
  },
  async moderate(reviewId: string, payload: ModerateReviewRequest) {
    const { data } = await api.patch(`/reviews/${reviewId}/moderation`, payload);
    return data;
  },
};
