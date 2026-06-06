import { StoreInfo } from "@/types/store";
import { mockStorage } from "./mockData";
// import { supabase } from "../supabase/client";

export async function getStoreInfo(): Promise<StoreInfo> {
  // --- 실제 Supabase API 구현 (주석 처리) ---
  /*
  const { data, error } = await supabase
    .from("store_info")
    .select("*")
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  return data as StoreInfo;
  */

  // --- 데모용 Mock 데이터 반환 ---
  // API 지연을 연출하기 위한 비동기 처리
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockStorage.getStoreInfo();
}
