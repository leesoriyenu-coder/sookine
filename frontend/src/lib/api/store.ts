import { StoreInfo } from "@/types/store";
import { supabase } from "../supabase/client";

export async function getStoreInfo(): Promise<StoreInfo> {
  try {
    const { data, error } = await supabase
      .from("store_info")
      .select("*")
      .single();
    
    if (error || !data) {
      throw new Error(error?.message || "No store info data found");
    }
    return data as StoreInfo;
  } catch (err: any) {
    console.warn("Failed to fetch store info from Supabase, using local fallback:", err.message);
    return {
      id: "fallback-id",
      status: "open",
      open_time: "11:40",
      break_start: "14:00",
      break_end: "17:00",
      close_time: "20:00",
      last_order: "19:30",
      regular_holiday: "매주 일요일",
      phone: "055-742-4472",
      address_road: "경상남도 진주시 신안로 161",
      address_jibun: "진주시 이현동 29-29",
      parking_info: "전용 주차장은 없습니다.",
      payment_methods: ["카드", "계좌이체", "진주사랑상품권"],
      caution_notes: ["재료 소진 시 조기마감 가능"],
      slogan: "엄마가 정성스럽게 차려주는 집밥 한 상차림",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }
}
