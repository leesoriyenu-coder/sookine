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
      .from("menus")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      return errorResponse("DB_ERROR", error.message, 500);
    }

    return successResponse(data);
  } catch (err: any) {
    return errorResponse("INTERNAL_ERROR", err.message || "메뉴 목록 조회 중 오류 발생", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const isAuthorized = await verifyAdminSession(req);
    if (!isAuthorized) {
      return errorResponse("UNAUTHORIZED", "인증이 필요한 요청입니다.", 401);
    }

    const body = await req.json();

    // 비즈니스 룰 검증
    if (body.is_signature && body.category !== "signature") {
      return errorResponse("VALIDATION_ERROR", "대표 메뉴인 경우 카테고리는 signature이어야 합니다.");
    }
    if (body.is_seasonal && body.category !== "seasonal") {
      return errorResponse("VALIDATION_ERROR", "시즌 메뉴인 경우 카테고리는 seasonal이어야 합니다.");
    }

    const supabase = createSupabaseServerClient(true);
    
    // 새 메뉴 등록
    const { data, error } = await supabase
      .from("menus")
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
    return errorResponse("INTERNAL_ERROR", err.message || "메뉴 등록 중 오류 발생", 500);
  }
}
export const dynamic = "force-dynamic";
