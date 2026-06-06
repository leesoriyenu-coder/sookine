import { ApiResponse, PaginatedResponse } from "@/types/api";
import { Notice } from "@/types/notice";
import { adminClient } from "./client";

export async function adminGetNotices(
  limit: number = 20,
  offset: number = 0
): Promise<PaginatedResponse<Notice>> {
  return adminClient.get<Notice[]>(`/notices?limit=${limit}&offset=${offset}`) as Promise<PaginatedResponse<Notice>>;
}

export async function createNotice(noticeData: Omit<Notice, "id" | "created_at" | "updated_at">): Promise<ApiResponse<Notice>> {
  return adminClient.post<Notice>("/notices", noticeData);
}

export async function updateNotice(id: string, noticeData: Partial<Notice>): Promise<ApiResponse<Notice>> {
  return adminClient.patch<Notice>(`/notices/${id}`, noticeData);
}

export async function deleteNotice(id: string): Promise<ApiResponse<{ message: string; deleted_id: string }>> {
  return adminClient.del<{ message: string; deleted_id: string }>(`/notices/${id}`);
}
export const dynamic = "force-dynamic";
