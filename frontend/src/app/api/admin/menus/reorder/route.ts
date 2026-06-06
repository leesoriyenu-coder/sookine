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

    const { orders } = await req.json();

    if (!Array.isArray(orders) || orders.length === 0) {
      return errorResponse("BAD_REQUEST", "유효한 순서 데이터가 필요합니다.", 400);
    }

    const supabase = createSupabaseServerClient(true);
    
    // 각 메뉴 순서 벌크 업데이트
    // Supabase RPC나 다중 업데이트 수행
    for (const item of orders) {
      await supabase
        .from("menus")
        .update({ sort_order: item.sort_order })
        .eq("id", item.id);
    }

    // 메인 페이지 캐시 무효화 (On-Demand Revalidation)
    revalidatePath("/");

    return successResponse({
      message: "메뉴 순서가 변경되었습니다.",
      updated_count: orders.length
    });
  } catch (err: any) {
    return errorResponse("INTERNAL_ERROR", err.message || "메뉴 순서 변경 중 오류 발생", 500);
  }
}
