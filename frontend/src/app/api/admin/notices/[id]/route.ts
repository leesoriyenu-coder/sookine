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

    // 긴급 공지(is_urgent = true)로 업데이트하는 경우, 기존의 긴급 공지를 모두 해제
    if (body.is_urgent) {
      await supabase
        .from("notices")
        .update({ is_urgent: false })
        .eq("is_urgent", true);
    }

    const { data, error } = await supabase
      .from("notices")
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
    return errorResponse("INTERNAL_ERROR", err.message || "공지사항 수정 중 오류 발생", 500);
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

    const { error } = await supabase
      .from("notices")
      .delete()
      .eq("id", id);

    if (error) {
      return errorResponse("DB_ERROR", error.message, 500);
    }

    // 메인 페이지 캐시 무효화 (On-Demand Revalidation)
    revalidatePath("/");

    return successResponse({
      message: "공지사항이 삭제되었습니다.",
      deleted_id: id
    });
  } catch (err: any) {
    return errorResponse("INTERNAL_ERROR", err.message || "공지사항 삭제 중 오류 발생", 500);
  }
}
