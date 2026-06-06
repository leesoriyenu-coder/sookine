import { ApiResponse } from "@/types/api";
import { adminClient } from "./client";

export async function revalidatePaths(paths: string[] = ["/"]): Promise<ApiResponse<{ revalidated: string[]; message: string }>> {
  try {
    const secret = "sookine-revalidate-secret-2026";
    for (const path of paths) {
      await fetch(`/api/revalidate?secret=${secret}&path=${path}`);
    }
    return adminClient.success({
      revalidated: paths,
      message: "캐시가 갱신되었습니다."
    });
  } catch (err: any) {
    return adminClient.error("INTERNAL_ERROR", "캐시 갱신 요청 실패");
  }
}
export const dynamic = "force-dynamic";
