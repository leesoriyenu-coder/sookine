import { ApiResponse, PaginatedResponse } from "@/types/api";
import { Notice } from "@/types/notice";
import { adminClient } from "./client";
import { mockStorage } from "../api/mockData";

export async function adminGetNotices(
  limit: number = 20,
  offset: number = 0
): Promise<PaginatedResponse<Notice>> {
  // --- 실제 API (주석 처리) ---
  /*
  // fetch GET /admin/notices...
  */

  await new Promise((resolve) => setTimeout(resolve, 200));
  const allNotices = mockStorage.getNotices();
  
  const total = allNotices.length;
  const data = allNotices.slice(offset, offset + limit);
  const has_next = offset + limit < total;

  return {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      pagination: { total, limit, offset, has_next }
    }
  };
}

export async function createNotice(noticeData: Omit<Notice, "id" | "created_at" | "updated_at">): Promise<ApiResponse<Notice>> {
  // --- 실제 API (주석 처리) ---
  /*
  // fetch POST /admin/notices...
  */

  await new Promise((resolve) => setTimeout(resolve, 300));
  const notices = mockStorage.getNotices();

  // 비즈니스 룰: is_urgent가 true이면 기존 모든 공지의 is_urgent를 false로 변경
  if (noticeData.is_urgent) {
    notices.forEach((n) => {
      if (n.is_urgent) {
        n.is_urgent = false;
        n.updated_at = new Date().toISOString();
      }
    });
  }

  const newNotice: Notice = {
    ...noticeData,
    id: "notice-" + Math.random().toString(36).substring(2, 9),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  notices.push(newNotice);
  mockStorage.saveNotices(notices);
  
  return adminClient.success(newNotice);
}

export async function updateNotice(id: string, noticeData: Partial<Notice>): Promise<ApiResponse<Notice>> {
  // --- 실제 API (주석 처리) ---
  /*
  // fetch PATCH /admin/notices/{id}...
  */

  await new Promise((resolve) => setTimeout(resolve, 300));
  const notices = mockStorage.getNotices();
  const index = notices.findIndex((n) => n.id === id);
  if (index === -1) {
    return adminClient.error("NOT_FOUND", "해당 공지사항을 찾을 수 없습니다.");
  }

  // 비즈니스 룰: is_urgent가 true로 변경되면 기존 모든 공지의 is_urgent를 false로 변경
  if (noticeData.is_urgent) {
    notices.forEach((n, idx) => {
      if (n.is_urgent && idx !== index) {
        n.is_urgent = false;
        n.updated_at = new Date().toISOString();
      }
    });
  }

  const updatedNotice = {
    ...notices[index],
    ...noticeData,
    updated_at: new Date().toISOString(),
  } as Notice;

  notices[index] = updatedNotice;
  mockStorage.saveNotices(notices);
  
  return adminClient.success(updatedNotice);
}

export async function deleteNotice(id: string): Promise<ApiResponse<{ message: string; deleted_id: string }>> {
  // --- 실제 API (주석 처리) ---
  /*
  // fetch DELETE /admin/notices/{id}...
  */

  await new Promise((resolve) => setTimeout(resolve, 200));
  let notices = mockStorage.getNotices();
  const exists = notices.some((n) => n.id === id);
  if (!exists) {
    return adminClient.error("NOT_FOUND", "해당 공지사항을 찾을 수 없습니다.");
  }

  notices = notices.filter((n) => n.id !== id);
  mockStorage.saveNotices(notices);
  
  return adminClient.success({
    message: "공지사항이 삭제되었습니다.",
    deleted_id: id,
  });
}
