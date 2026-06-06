import { SideDish } from "@/types/side-dish";
import { supabase } from "../supabase/client";

export async function getSideDishes(): Promise<SideDish[]> {
  try {
    const { data, error } = await supabase
      .from("side_dishes")
      .select("*")
      .eq("is_visible", true)
      .order("sort_order", { ascending: true });
    
    if (error) {
      throw new Error(error.message);
    }
    return (data || []) as SideDish[];
  } catch (err: any) {
    console.warn("Failed to fetch side dishes from Supabase, returning empty array:", err.message);
    return [];
  }
}
