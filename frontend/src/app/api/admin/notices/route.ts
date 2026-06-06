import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { successResponse, errorResponse, verifyAdminSession } from "@/lib/admin-api/server-utils";
import { revalidatePath } from "next/cache";
import { Notice } from "@/types/notice";

export async function GET(req: NextRequest) {
  try {
    const isAuthorized = await verifyAdminSession(req);
    if (!isAuthorized) {
      return errorResponse("UNAUTHORIZED", "인증이 필요한 요청입니다.", 401);
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    const supabase = createSupabaseServerClient(true);
    const { data, error, count } = await supabase
      .from("notices")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return errorResponse("DB_ERROR", error.message, 500);
    }

    const total = count || 0;
    const has_next = offset + limit < total;

    return NextResponse.json({
      success: true,
      data: data as Notice[],
      meta: {
        timestamp: new Date().toISOString(),
        pagination: { total, limit, offset, has_next }
      }
    });
  } catch (err: any) {
    return errorResponse("INTERNAL_ERROR", err.message || "공지사항 조회 중 오류 발생", 500);
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

    // 긴급 공지(is_urgent = true)로 설정하는 경우, 기존의 긴급 공지를 모두 해제
    if (body.is_urgent) {
      await supabase
        .from("notices")
        .update({ is_urgent: false })
        .eq("is_urgent", true);
    }

    const { data, error } = await supabase
      .from("notices")
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
    return errorResponse("INTERNAL_ERROR", err.message || "공지사항 등록 중 오류 발생", 500);
  }
}
export const dynamic = "force-dynamic";
