import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { successResponse, errorResponse } from "@/lib/admin-api/server-utils";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    const configPassword = process.env.ADMIN_PASSWORD || "1234";

    if (password !== configPassword) {
      return errorResponse("UNAUTHORIZED", "비밀번호가 올바르지 않습니다.", 401);
    }

    // 세션 토큰 생성 (UUID)
    const sessionToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24시간 후 만료

    // DB에 세션 저장 (service_role 사용)
    const supabase = createSupabaseServerClient(true);
    const { error } = await supabase
      .from("admin_sessions")
      .insert({
        session_token: sessionToken,
        expires_at: expiresAt
      });

    if (error) {
      return errorResponse("DB_ERROR", "세션을 생성하는 중 오류가 발생했습니다: " + error.message, 500);
    }

    // 클라이언트 쿠키 및 세션 토큰 반환
    const response = successResponse({
      session_token: sessionToken,
      expires_at: expiresAt
    });

    // Proxy에서 검증하기 위한 쿠키 설정
    response.cookies.set("sookine_session_token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 24시간
      path: "/"
    });

    return response;
  } catch (err: any) {
    return errorResponse("INTERNAL_ERROR", err.message || "로그인 중 오류 발생", 500);
  }
}
