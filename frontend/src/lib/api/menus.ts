import { Menu, GroupedMenus } from "@/types/menu";
import { mockStorage } from "./mockData";
// import { supabase } from "../supabase/client";

export async function getMenus(): Promise<Menu[]> {
  // --- 실제 Supabase API 구현 (주석 처리) ---
  /*
  const { data, error } = await supabase
    .from("menus")
    .select("*")
    .eq("is_visible", true)
    .order("sort_order", { ascending: true });
  
  if (error) {
    throw new Error(error.message);
  }
  return data as Menu[];
  */

  // --- 데모용 Mock 데이터 반환 ---
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockStorage.getMenus().filter((m) => m.is_visible);
}

export async function getMenusByCategory(): Promise<GroupedMenus> {
  const allMenus = await getMenus();
  
  return {
    signature: allMenus.filter((m) => m.is_signature),
    seasonal: allMenus.filter((m) => m.is_seasonal && !m.is_signature),
    regular: allMenus.filter((m) => !m.is_signature && !m.is_seasonal),
  };
}
