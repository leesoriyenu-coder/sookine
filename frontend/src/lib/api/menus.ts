import { Menu, GroupedMenus } from "@/types/menu";
import { supabase } from "../supabase/client";

export async function getMenus(): Promise<Menu[]> {
  try {
    const { data, error } = await supabase
      .from("menus")
      .select("*")
      .eq("is_visible", true)
      .order("sort_order", { ascending: true });
    
    if (error) {
      throw new Error(error.message);
    }
    return (data || []) as Menu[];
  } catch (err: any) {
    console.warn("Failed to fetch menus from Supabase, returning empty array:", err.message);
    return [];
  }
}

export async function getMenusByCategory(): Promise<GroupedMenus> {
  const allMenus = await getMenus();
  
  return {
    signature: allMenus.filter((m) => m.is_signature),
    seasonal: allMenus.filter((m) => m.is_seasonal && !m.is_signature),
    regular: allMenus.filter((m) => !m.is_signature && !m.is_seasonal),
  };
}
