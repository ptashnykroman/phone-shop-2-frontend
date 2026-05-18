import { api } from "@/shared/api/axios-instance";
import type {
  CharacteristicExplanation,
  CharacteristicExplanationPayload,
} from "@/shared/api/api-types";

export const explanationsApi = {
  async list() {
    const { data } = await api.get<CharacteristicExplanation[]>(
      "/characteristic-explanations",
    );
    return data;
  },
  async create(payload: CharacteristicExplanationPayload) {
    const { data } = await api.post<CharacteristicExplanation>(
      "/characteristic-explanations",
      payload,
    );
    return data;
  },
  async update(
    explanationId: string,
    payload: Partial<CharacteristicExplanationPayload>,
  ) {
    const { data } = await api.patch<CharacteristicExplanation>(
      `/characteristic-explanations/${explanationId}`,
      payload,
    );
    return data;
  },
  async remove(explanationId: string) {
    const { data } = await api.delete<{ success: true }>(
      `/characteristic-explanations/${explanationId}`,
    );
    return data;
  },
};
