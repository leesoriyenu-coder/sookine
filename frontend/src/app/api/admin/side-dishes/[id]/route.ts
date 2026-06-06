import { NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { successResponse, errorResponse, verifyAdminSession } from "@/lib/admin-api/server-utils";
import { revalidatePath } from "next/cache";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAuthorized = await verifyAdminSession(req);
    if (!isAuthorized) {
      return errorResponse("UNAUTHORIZED", "인증이 필요한 요청입니다.", 401);
    }

    const { id } = await params;
    const body = await req.json();

    const supabase = createSupabaseServerClient(true);
    
    // 대상 존재 확인
    const { data: existingDish, error: findError } = await supabase
      .from("side_dishes")
      .select("*")
      .eq("id", id)
      .single();

    if (findError || !existingDish) {
      return errorResponse("NOT_FOUND", "해당 기본찬을 찾을 수 없습니다.", 404);
    }

    const { data, error } = await supabase
      .from("side_dishes")
      .update(body)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return errorResponse("DB_ERROR", error.message, 500);
    }

    // 메인 페이지 캐시 무효화 (On-Demand Revalidation)
    revalidatePath("/");

    return successResponse(data);
  } catch (err: any) {
    return errorResponse("INTERNAL_ERROR", err.message || "기본찬 수정 중 오류 발생", 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAuthorized = await verifyAdminSession(req);
    if (!isAuthorized) {
      return errorResponse("UNAUTHORIZED", "인증이 필요한 요청입니다.", 401);
    }

    const { id } = await params;
    const supabase = createSupabaseServerClient(true);

    // 대상 기본찬 정보 가져오기 (이미지 삭제용)
    const { data: dish, error: findError } = await supabase
      .from("side_dishes")
      .select("*")
      .eq("id", id)
      .single();

    if (findError || !dish) {
      return errorResponse("NOT_FOUND", "해당 기본찬을 찾을 수 없습니다.", 404);
    }

    // 이미지가 있다면 Storage에서 먼저 제거
    if (dish.image_path) {
      const pathOnly = dish.image_path.includes("/")
        ? dish.image_path.split("/").slice(1).join("/")
        : dish.image_path;
        
      await supabase.storage
        .from("side-dish-images")
        .remove([pathOnly]);
    }

    // 레코드 삭제
    const { error } = await supabase
      .from("side_dishes")
      .delete()
      .eq("id", id);

    if (error) {
      return errorResponse("DB_ERROR", error.message, 500);
    }

    // 메인 페이지 캐시 무효화 (On-Demand Revalidation)
    revalidatePath("/");

    return successResponse({
      message: "기본찬이 삭제되었습니다.",
      deleted_id: id
    });
  } catch (err: any) {
    return errorResponse("INTERNAL_ERROR", err.message || "기본찬 삭제 중 오류 발생", 500);
  }
}
