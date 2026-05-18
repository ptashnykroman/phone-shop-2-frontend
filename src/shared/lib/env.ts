const rawApiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export const API_BASE_URL = rawApiUrl.endsWith("/api")
  ? rawApiUrl
  : `${rawApiUrl}/api`;
