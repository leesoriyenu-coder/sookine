import { Notice } from "@/types/notice";
import { PaginatedResponse, ApiResponse } from "@/types/api";
import { mockStorage } from "./mockData";
// import { supabase } from "../supabase/client";

export async function getNotices(
  limit: number = 5,
  offset: number = 0
): Promise<PaginatedResponse<Notice>> {
  // --- 실제 Supabase API 구현 (주석 처리) ---
  /*
  const { data, error, count } = await supabase
    .from("notices")
    .select("*", { count: "exact" })
    .eq("is_visible", true)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);
  
  if (error) {
    return {
      success: false,
      meta: { timestamp: new Date().toISOString() },
      error: { code: "INTERNAL_ERROR", message: error.message }
    };
  }

  const total = count || 0;
  const has_next = offset + limit < total;

  return {
    success: true,
    data: data as Notice[],
    meta: {
      timestamp: new Date().toISOString(),
      pagination: { total, limit, offset, has_next }
    }
  };
  */

  // --- 데모용 Mock 데이터 반환 ---
  await new Promise((resolve) => setTimeout(resolve, 100));
  const allNotices = mockStorage.getNotices().filter((n) => n.is_visible);
  
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

export async function getUrgentNotice(): Promise<Notice | null> {
  // --- 실제 Supabase API 구현 (주석 처리) ---
  /*
  const { data, error } = await supabase
    .from("notices")
    .select("*")
    .eq("is_urgent", true)
    .eq("is_visible", true)
    .order("created_at", { ascending: false })
    .limit(1);
  
  if (error || !data || data.length === 0) {
    return null;
  }
  return data[0] as Notice;
  */

  // --- 데모용 Mock 데이터 반환 ---
  await new Promise((resolve) => setTimeout(resolve, 50));
  const urgent = mockStorage.getNotices().find((n) => n.is_urgent && n.is_visible);
  return urgent || null;
}
