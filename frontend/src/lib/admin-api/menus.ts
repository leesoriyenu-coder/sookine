import { ApiResponse } from "@/types/api";
import { Menu } from "@/types/menu";
import { ReorderItem } from "@/types/admin";
import { adminClient } from "./client";

export async function adminGetMenus(): Promise<ApiResponse<Menu[]>> {
  return adminClient.get<Menu[]>("/menus");
}

export async function createMenu(menuData: Omit<Menu, "id" | "created_at" | "updated_at">): Promise<ApiResponse<Menu>> {
  return adminClient.post<Menu>("/menus", menuData);
}

export async function updateMenu(id: string, menuData: Partial<Menu>): Promise<ApiResponse<Menu>> {
  return adminClient.patch<Menu>(`/menus/${id}`, menuData);
}

export async function deleteMenu(id: string): Promise<ApiResponse<{ message: string; deleted_id: string }>> {
  return adminClient.del<{ message: string; deleted_id: string }>(`/menus/${id}`);
}

export async function reorderMenus(orders: ReorderItem[]): Promise<ApiResponse<{ message: string; updated_count: number }>> {
  return adminClient.patch<{ message: string; updated_count: number }>("/menus/reorder", { orders });
}
