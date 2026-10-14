import { apiRequest } from "@/lib/api/client";
import type { AuthResponse, UserPublic } from "@/lib/types";

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  email: string;
  username: string;
  password: string;
  displayName?: string;
};

export function login(payload: LoginPayload) {
  return apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: payload,
  });
}

export function register(payload: RegisterPayload) {
  return apiRequest<UserPublic>("/auth/register", {
    method: "POST",
    body: payload,
  });
}

export function getMe(token: string) {
  return apiRequest<UserPublic>("/auth/me", { token });
}
