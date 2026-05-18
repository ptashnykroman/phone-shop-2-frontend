import { api } from "@/shared/api/axios-instance";
import type {
  AuthResponse,
  LoginRequest,
  RefreshTokenRequest,
  SafeUser,
  RegisterRequest,
} from "@/shared/api/api-types";

export const authApi = {
  async register(payload: RegisterRequest) {
    const { data } = await api.post<AuthResponse>("/auth/register", payload);
    return data;
  },
  async login(payload: LoginRequest) {
    const { data } = await api.post<AuthResponse>("/auth/login", payload);
    return data;
  },
  async refresh(payload: RefreshTokenRequest) {
    const { data } = await api.post<AuthResponse>("/auth/refresh", payload);
    return data;
  },
  async logout() {
    const { data } = await api.post<{ success: true }>("/auth/logout");
    return data;
  },
  async me() {
    const { data } = await api.get<SafeUser>("/auth/me");
    return data;
  },
};
