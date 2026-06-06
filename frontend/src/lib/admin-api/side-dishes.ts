import { ApiResponse } from "@/types/api";
import { SideDish } from "@/types/side-dish";
import { ReorderItem } from "@/types/admin";
import { adminClient } from "./client";

export async function adminGetSideDishes(): Promise<ApiResponse<SideDish[]>> {
  return adminClient.get<SideDish[]>("/side-dishes");
}

export async function createSideDish(dishData: Omit<SideDish, "id" | "created_at" | "updated_at">): Promise<ApiResponse<SideDish>> {
  return adminClient.post<SideDish>("/side-dishes", dishData);
}

export async function updateSideDish(id: string, dishData: Partial<SideDish>): Promise<ApiResponse<SideDish>> {
  return adminClient.patch<SideDish>(`/side-dishes/${id}`, dishData);
}

export async function deleteSideDish(id: string): Promise<ApiResponse<{ message: string; deleted_id: string }>> {
  return adminClient.del<{ message: string; deleted_id: string }>(`/side-dishes/${id}`);
}

export async function reorderSideDishes(orders: ReorderItem[]): Promise<ApiResponse<{ message: string; updated_count: number }>> {
  return adminClient.patch<{ message: string; updated_count: number }>("/side-dishes/reorder", { orders });
}
export const dynamic = "force-dynamic";
