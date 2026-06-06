import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { successResponse, errorResponse } from "@/lib/admin-api/server-utils";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    let token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;

    if (!token) {
      token = req.cookies.get("sookine_session_token")?.value || null;
    }

    if (token) {
      const supabase = createSupabaseServerClient(true);
      await supabase
        .from("admin_sessions")
        .delete()
        .eq("session_token", token);
    }

    const response = successResponse({ message: "로그아웃되었습니다." });
    
    // 쿠키 삭제
    response.cookies.set("sookine_session_token", "", {
      maxAge: 0,
      path: "/"
    });

    return response;
  } catch (err: any) {
    return errorResponse("INTERNAL_ERROR", err.message || "로그아웃 중 오류 발생", 500);
  }
}
