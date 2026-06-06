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
      .from("store_info")
      .select("*")
      .single();

    if (error) {
      return errorResponse("DB_ERROR", error.message, 500);
    }

    return successResponse(data);
  } catch (err: any) {
    return errorResponse("INTERNAL_ERROR", err.message || "매장 정보 조회 중 오류 발생", 500);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const isAuthorized = await verifyAdminSession(req);
    if (!isAuthorized) {
      return errorResponse("UNAUTHORIZED", "인증이 필요한 요청입니다.", 401);
    }

    const body = await req.json();

    const supabase = createSupabaseServerClient(true);
    
    // store_info는 1행짜리 테이블이므로 id를 가져오기 위해 먼저 조회하거나, 단일 업데이트
    const { data: currentInfo, error: fetchError } = await supabase
      .from("store_info")
      .select("id")
      .single();

    if (fetchError || !currentInfo) {
      return errorResponse("NOT_FOUND", "기존 매장 정보를 찾을 수 없습니다.", 404);
    }

    const { data, error } = await supabase
      .from("store_info")
      .update(body)
      .eq("id", currentInfo.id)
      .select()
      .single();

    if (error) {
      return errorResponse("DB_ERROR", error.message, 500);
    }

    // 메인 페이지 캐시 무효화 (On-Demand Revalidation)
    revalidatePath("/");

    return successResponse(data);
  } catch (err: any) {
    return errorResponse("INTERNAL_ERROR", err.message || "매장 정보 수정 중 오류 발생", 500);
  }
}
export const dynamic = "force-dynamic";
