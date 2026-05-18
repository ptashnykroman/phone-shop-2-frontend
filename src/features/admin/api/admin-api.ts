import { api } from "@/shared/api/axios-instance";
import type {
  AdminOverview,
  PaginatedResponse,
  SafeUser,
  UserListQuery,
} from "@/shared/api/api-types";
import { compactParams } from "@/shared/utils/request-params";

export const adminApi = {
  async overview() {
    const { data } = await api.get<AdminOverview>("/admin/overview");
    return data;
  },
  async users(query: UserListQuery = {}) {
    const { data } = await api.get<PaginatedResponse<SafeUser>>("/admin/users", {
      params: compactParams(query),
    });
    return data;
  },
};
