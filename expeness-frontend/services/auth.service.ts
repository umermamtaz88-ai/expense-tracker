import { apiGet, apiPost } from "./api";
import type { AuthResponse, LoginRequest, SignupRequest, User } from "@/types";

export const authService = {
  signup(data: SignupRequest): Promise<AuthResponse> {
    return apiPost<AuthResponse>("/auth/signup", data);
  },

  login(data: LoginRequest): Promise<AuthResponse> {
    return apiPost<AuthResponse>("/auth/login", data);
  },

  getMe(): Promise<User> {
    return apiGet<User>("/auth/me");
  },
};
