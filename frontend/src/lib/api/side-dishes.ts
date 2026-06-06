import { SideDish } from "@/types/side-dish";
import { mockStorage } from "./mockData";
// import { supabase } from "../supabase/client";

export async function getSideDishes(): Promise<SideDish[]> {
  // --- 실제 Supabase API 구현 (주석 처리) ---
  /*
  const { data, error } = await supabase
    .from("side_dishes")
    .select("*")
    .eq("is_visible", true)
    .order("sort_order", { ascending: true });
  
  if (error) {
    throw new Error(error.message);
  }
  return data as SideDish[];
  */

  // --- 데모용 Mock 데이터 반환 ---
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockStorage.getSideDishes().filter((s) => s.is_visible);
}
