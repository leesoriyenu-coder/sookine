import { ApiResponse } from "@/types/api";
import { LoginResponse } from "@/types/admin";
import { adminClient } from "./client";

export async function adminLogin(password: string): Promise<ApiResponse<LoginResponse>> {
  return adminClient.post<LoginResponse>("/login", { password });
}

export async function adminLogout(): Promise<ApiResponse<{ message: string }>> {
  return adminClient.post<{ message: string }>("/logout", {});
}

export async function verifySession(token: string): Promise<ApiResponse<{ valid: boolean; expires_at: string }>> {
  return adminClient.get<{ valid: boolean; expires_at: string }>("/verify");
}
