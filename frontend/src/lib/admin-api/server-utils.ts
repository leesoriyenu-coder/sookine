import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "../supabase/server";
import { ApiResponse } from "@/types/api";

// 표준 성공 응답
export function successResponse<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    meta: { timestamp: new Date().toISOString() }
  }, { status });
}

// 표준 에러 응답
export function errorResponse(code: string, message: string, status = 400): NextResponse<ApiResponse<null>> {
  return NextResponse.json({
    success: false,
    meta: { timestamp: new Date().toISOString() },
    error: { code, message }
  }, { status });
}

// 세션 토큰 확인 및 검증
export async function verifyAdminSession(req: NextRequest): Promise<boolean> {
  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;
  
  if (!token) {
    return false;
  }
  
  // RLS를 우회하기 위해 service_role 키를 사용한 서버 클라이언트 생성
  const supabase = createSupabaseServerClient(true);
  
  const { data, error } = await supabase
    .from("admin_sessions")
    .select("*")
    .eq("session_token", token)
    .gt("expires_at", new Date().toISOString())
    .single();
    
  if (error || !data) {
    return false;
  }
  
  return true;
}
