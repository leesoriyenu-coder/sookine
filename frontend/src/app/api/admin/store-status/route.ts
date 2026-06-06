import { NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { successResponse, errorResponse, verifyAdminSession } from "@/lib/admin-api/server-utils";
import { revalidatePath } from "next/cache";

export async function PATCH(req: NextRequest) {
  try {
    const isAuthorized = await verifyAdminSession(req);
    if (!isAuthorized) {
      return errorResponse("UNAUTHORIZED", "인증이 필요한 요청입니다.", 401);
    }

    const { status } = await req.json();

    if (!["open", "break", "closed", "holiday"].includes(status)) {
      return errorResponse("BAD_REQUEST", "올바르지 않은 영업 상태값입니다.", 400);
    }

    const supabase = createSupabaseServerClient(true);
    
    const { data: currentInfo, error: fetchError } = await supabase
      .from("store_info")
      .select("id")
      .single();

    if (fetchError || !currentInfo) {
      return errorResponse("NOT_FOUND", "매장 정보를 찾을 수 없습니다.", 404);
    }

    const { data, error } = await supabase
      .from("store_info")
      .update({ status })
      .eq("id", currentInfo.id)
      .select()
      .single();

    if (error) {
      return errorResponse("DB_ERROR", error.message, 500);
    }

    // 메인 페이지 캐시 무효화 (On-Demand Revalidation)
    revalidatePath("/");

    return successResponse({
      status: data.status,
      updated_at: data.updated_at
    });
  } catch (err: any) {
    return errorResponse("INTERNAL_ERROR", err.message || "영업 상태 변경 중 오류 발생", 500);
  }
}
