import { NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { successResponse, errorResponse, verifyAdminSession } from "@/lib/admin-api/server-utils";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const isAuthorized = await verifyAdminSession(req);
    if (!isAuthorized) {
      return errorResponse("UNAUTHORIZED", "인증이 필요한 요청입니다.", 401);
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const bucket = formData.get("bucket") as string;

    if (!file || !bucket) {
      return errorResponse("BAD_REQUEST", "파일과 버킷 정보가 누락되었습니다.", 400);
    }

    // 파일 타입 및 크기 제한 검증
    if (file.size > 5 * 1024 * 1024) {
      return errorResponse("BAD_REQUEST", "이미지 크기는 최대 5MB를 초과할 수 없습니다.", 400);
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return errorResponse("BAD_REQUEST", "JPG, PNG, WebP, GIF 형식의 이미지만 업로드 가능합니다.", 400);
    }

    // 파일명 생성: UUID + 확장자
    const fileExtension = file.name.split(".").pop() || "webp";
    const uniqueFilename = `${crypto.randomUUID()}.${fileExtension}`;

    const supabase = createSupabaseServerClient(true);
    
    // File을 ArrayBuffer로 변환하여 업로드
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(uniqueFilename, buffer, {
        contentType: file.type,
        upsert: true
      });

    if (error) {
      return errorResponse("STORAGE_ERROR", "이미지 업로드에 실패했습니다: " + error.message, 500);
    }

    // 이미지 공개 URL 가져오기
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(uniqueFilename);

    return successResponse({
      url: publicUrl,
      path: `${bucket}/${uniqueFilename}`
    });
  } catch (err: any) {
    return errorResponse("INTERNAL_ERROR", err.message || "이미지 업로드 중 오류 발생", 500);
  }
}
export const dynamic = "force-dynamic";
