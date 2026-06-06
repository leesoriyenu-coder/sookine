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
    
    // 대상 메뉴 존재 확인
    const { data: existingMenu, error: findError } = await supabase
      .from("menus")
      .select("*")
      .eq("id", id)
      .single();

    if (findError || !existingMenu) {
      return errorResponse("NOT_FOUND", "해당 메뉴를 찾을 수 없습니다.", 404);
    }

    // 머지된 상태에서 비즈니스 룰 검증
    const updatedMenu = { ...existingMenu, ...body };
    if (updatedMenu.is_signature && updatedMenu.category !== "signature") {
      return errorResponse("VALIDATION_ERROR", "대표 메뉴인 경우 카테고리는 signature이어야 합니다.");
    }
    if (updatedMenu.is_seasonal && updatedMenu.category !== "seasonal") {
      return errorResponse("VALIDATION_ERROR", "시즌 메뉴인 경우 카테고리는 seasonal이어야 합니다.");
    }

    const { data, error } = await supabase
      .from("menus")
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
    return errorResponse("INTERNAL_ERROR", err.message || "메뉴 수정 중 오류 발생", 500);
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

    // 대상 메뉴 정보 가져오기 (이미지 삭제용)
    const { data: menu, error: findError } = await supabase
      .from("menus")
      .select("*")
      .eq("id", id)
      .single();

    if (findError || !menu) {
      return errorResponse("NOT_FOUND", "해당 메뉴를 찾을 수 없습니다.", 404);
    }

    // 이미지가 있다면 Storage에서 먼저 제거
    if (menu.image_path) {
      // image_path는 'menu-images/filename.webp' 형태일 것임
      // supabase.storage.from('menu-images').remove(['filename.webp']) 형태로 삭제
      const pathOnly = menu.image_path.includes("/")
        ? menu.image_path.split("/").slice(1).join("/")
        : menu.image_path;
        
      await supabase.storage
        .from("menu-images")
        .remove([pathOnly]);
    }

    // 레코드 삭제
    const { error } = await supabase
      .from("menus")
      .delete()
      .eq("id", id);

    if (error) {
      return errorResponse("DB_ERROR", error.message, 500);
    }

    // 메인 페이지 캐시 무효화 (On-Demand Revalidation)
    revalidatePath("/");

    return successResponse({
      message: "메뉴가 삭제되었습니다.",
      deleted_id: id
    });
  } catch (err: any) {
    return errorResponse("INTERNAL_ERROR", err.message || "메뉴 삭제 중 오류 발생", 500);
  }
}
