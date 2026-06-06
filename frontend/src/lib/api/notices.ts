import { Notice } from "@/types/notice";
import { PaginatedResponse } from "@/types/api";
import { supabase } from "../supabase/client";

export async function getNotices(
  limit: number = 5,
  offset: number = 0
): Promise<PaginatedResponse<Notice>> {
  try {
    const { data, error, count } = await supabase
      .from("notices")
      .select("*", { count: "exact" })
      .eq("is_visible", true)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) {
      throw new Error(error.message);
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
  } catch (err: any) {
    console.warn("Failed to fetch notices, returning empty response:", err.message);
    return {
      success: true,
      data: [],
      meta: {
        timestamp: new Date().toISOString(),
        pagination: { total: 0, limit, offset, has_next: false }
      }
    };
  }
}

export async function getUrgentNotice(): Promise<Notice | null> {
  try {
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
  } catch (err: any) {
    console.warn("Failed to fetch urgent notice:", err.message);
    return null;
  }
}
