import { ApiResponse } from "@/types/api";
import { adminClient } from "./client";

export async function revalidatePaths(paths: string[] = ["/"]): Promise<ApiResponse<{ revalidated: string[]; message: string }>> {
  // --- 실제 Next.js On-Demand Revalidation API 호출 (주석 처리) ---
  /*
  try {
    const response = await fetch(`${window.location.origin}/functions/v1/admin/revalidate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("sookine_session_token")}`
      },
      body: JSON.stringify({ paths })
    });
    return await response.json();
  } catch (err: any) {
    return adminClient.error("INTERNAL_ERROR", "캐시 갱신 요청 실패");
  }
  */

  // --- 데모용 Mock 캐시 갱신 ---
  console.log(`[Demo Revalidate] 캐시가 무효화되었습니다: ${paths.join(", ")}`);
  await new Promise((resolve) => setTimeout(resolve, 100));
  return adminClient.success({
    revalidated: paths,
    message: "캐시가 갱신되었습니다."
  });
}
