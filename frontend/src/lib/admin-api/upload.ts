import { ApiResponse } from "@/types/api";
import { UploadResult } from "@/types/admin";
import { adminClient } from "./client";

export async function uploadImage(file: File, bucket: string): Promise<ApiResponse<UploadResult>> {
  // --- 실제 Supabase Storage 업로드 API 구현 (주석 처리) ---
  /*
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("bucket", bucket);

    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/admin/upload`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("sookine_session_token")}`
      },
      body: formData
    });
    return await response.json();
  } catch (err: any) {
    return adminClient.error("INTERNAL_ERROR", "이미지 업로드 실패");
  }
  */

  // --- 데모용 Mock 업로드 처리 (FileReader로 Base64 URL 반환) ---
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  if (file.size > 5 * 1024 * 1024) {
    return adminClient.error("BAD_REQUEST", "이미지 크기는 최대 5MB를 초과할 수 없습니다.");
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return adminClient.error("BAD_REQUEST", "JPG, PNG, WebP 형식의 이미지만 업로드 가능합니다.");
  }

  // 데모 환경에서는 FileReader를 이용하여 Base64 Data URL을 생성해 리턴
  // 이렇게 하면 추가 서버가 없어도 브라우저 내에서 업로드한 사진을 완벽하게 볼 수 있습니다.
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Url = reader.result as string;
      const fakePath = `${bucket}/${Date.now()}-${file.name}`;
      resolve(adminClient.success<UploadResult>({
        url: base64Url,
        path: fakePath
      }));
    };
    reader.onerror = () => {
      resolve(adminClient.error("INTERNAL_ERROR", "파일을 읽는 중에 오류가 발생했습니다."));
    };
    reader.readAsDataURL(file);
  });
}
