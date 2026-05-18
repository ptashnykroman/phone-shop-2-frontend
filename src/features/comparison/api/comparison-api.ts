import { api } from "@/shared/api/axios-instance";
import type {
  CompareProductsRequest,
  ComparisonResponse,
} from "@/shared/api/api-types";

export const comparisonApi = {
  async compare(payload: CompareProductsRequest) {
    const { data } = await api.post<ComparisonResponse>("/products/compare", payload);
    return data;
  },
};
