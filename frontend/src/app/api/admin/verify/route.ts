import { NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { successResponse, errorResponse } from "@/lib/admin-api/server-utils";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    let token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;

    if (!token) {
      token = req.cookies.get("sookine_session_token")?.value || null;
    }

    if (!token) {
      return errorResponse("UNAUTHORIZED", "세션 토큰이 존재하지 않습니다.", 401);
    }

    const supabase = createSupabaseServerClient(true);
    const { data, error } = await supabase
      .from("admin_sessions")
      .select("*")
      .eq("session_token", token)
      .gt("expires_at", new Date().toISOString())
      .single();

    if (error || !data) {
      return errorResponse("UNAUTHORIZED", "세션이 만료되었거나 올바르지 않습니다.", 401);
    }

    return successResponse({
      valid: true,
      expires_at: data.expires_at
    });
  } catch (err: any) {
    return errorResponse("INTERNAL_ERROR", err.message || "세션 확인 중 오류 발생", 500);
  }
}
