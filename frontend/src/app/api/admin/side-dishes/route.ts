import { NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { successResponse, errorResponse, verifyAdminSession } from "@/lib/admin-api/server-utils";
import { revalidatePath } from "next/cache";

export async function GET(req: NextRequest) {
  try {
    const isAuthorized = await verifyAdminSession(req);
    if (!isAuthorized) {
      return errorResponse("UNAUTHORIZED", "인증이 필요한 요청입니다.", 401);
    }

    const supabase = createSupabaseServerClient(true);
    const { data, error } = await supabase
      .from("side_dishes")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      return errorResponse("DB_ERROR", error.message, 500);
    }

    return successResponse(data);
  } catch (err: any) {
    return errorResponse("INTERNAL_ERROR", err.message || "기본찬 목록 조회 중 오류 발생", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const isAuthorized = await verifyAdminSession(req);
    if (!isAuthorized) {
      return errorResponse("UNAUTHORIZED", "인증이 필요한 요청입니다.", 401);
    }

    const body = await req.json();
    const supabase = createSupabaseServerClient(true);

    const { data, error } = await supabase
      .from("side_dishes")
      .insert(body)
      .select()
      .single();

    if (error) {
      return errorResponse("DB_ERROR", error.message, 500);
    }

    // 메인 페이지 캐시 무효화 (On-Demand Revalidation)
    revalidatePath("/");

    return successResponse(data);
  } catch (err: any) {
    return errorResponse("INTERNAL_ERROR", err.message || "기본찬 등록 중 오류 발생", 500);
  }
}
