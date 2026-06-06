import { ApiResponse } from "@/types/api";
import { LoginResponse } from "@/types/admin";
import { adminClient } from "./client";
import { mockStorage } from "../api/mockData";

export async function adminLogin(password: string): Promise<ApiResponse<LoginResponse>> {
  // --- 실제 Supabase Edge Function 로그인 호출 (주석 처리) ---
  /*
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    return await response.json();
  } catch (err: any) {
    return adminClient.error("INTERNAL_ERROR", "로그인 요청 실패");
  }
  */

  // --- 데모용 Mock 로그인 처리 ---
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  if (password === "1234") {
    const sessionToken = "demo-session-token-" + Math.random().toString(36).substring(2, 10);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24시간 뒤 만료
    
    mockStorage.saveSessionToken(sessionToken);
    
    return adminClient.success<LoginResponse>({
      session_token: sessionToken,
      expires_at: expiresAt
    });
  } else {
    return adminClient.error("UNAUTHORIZED", "비밀번호가 올바르지 않습니다.");
  }
}

export async function adminLogout(): Promise<ApiResponse<{ message: string }>> {
  // --- 실제 Supabase Edge Function 로그아웃 호출 (주석 처리) ---
  /*
  // fetch 및 Authorization 토큰 삭제 로직...
  */

  // --- 데모용 Mock 로그아웃 처리 ---
  await new Promise((resolve) => setTimeout(resolve, 200));
  mockStorage.saveSessionToken("");
  return adminClient.success({ message: "로그아웃되었습니다." });
}

export async function verifySession(token: string): Promise<ApiResponse<{ valid: boolean; expires_at: string }>> {
  // --- 실제 Supabase Edge Function 세션 확인 호출 (주석 처리) ---
  /*
  // fetch /admin/verify 호출...
  */

  // --- 데모용 Mock 세션 검증 처리 ---
  await new Promise((resolve) => setTimeout(resolve, 100));
  const currentToken = mockStorage.getSessionToken();
  
  if (token && token === currentToken) {
    return adminClient.success({
      valid: true,
      expires_at: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString()
    });
  } else {
    return adminClient.error("UNAUTHORIZED", "세션이 만료되었거나 올바르지 않습니다.");
  }
}
