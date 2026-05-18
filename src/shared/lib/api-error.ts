import axios, { AxiosError } from "axios";
import type { ApiErrorResponse } from "@/shared/api/api-types";

export function isApiError(
  error: unknown,
): error is AxiosError<ApiErrorResponse> {
  return axios.isAxiosError(error);
}

export function getApiErrorMessage(error: unknown) {
  if (!isApiError(error)) {
    return error instanceof Error
      ? error.message
      : "Сталася непередбачена помилка.";
  }

  const message = error.response?.data?.message;

  if (Array.isArray(message)) {
    return message.join(". ");
  }

  if (typeof message === "string" && message.trim().length > 0) {
    return message;
  }

  return error.message || "Не вдалося виконати запит.";
}
