import { ApiResponse } from "@/types/api";
import { SideDish } from "@/types/side-dish";
import { ReorderItem } from "@/types/admin";
import { adminClient } from "./client";
import { mockStorage } from "../api/mockData";

export async function adminGetSideDishes(): Promise<ApiResponse<SideDish[]>> {
  // --- 실제 API (주석 처리) ---
  /*
  // fetch GET /admin/side-dishes...
  */

  await new Promise((resolve) => setTimeout(resolve, 200));
  return adminClient.success(mockStorage.getSideDishes());
}

export async function createSideDish(dishData: Omit<SideDish, "id" | "created_at" | "updated_at">): Promise<ApiResponse<SideDish>> {
  // --- 실제 API (주석 처리) ---
  /*
  // fetch POST /admin/side-dishes...
  */

  await new Promise((resolve) => setTimeout(resolve, 300));
  const sides = mockStorage.getSideDishes();

  const newDish: SideDish = {
    ...dishData,
    id: "side-" + Math.random().toString(36).substring(2, 9),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  sides.push(newDish);
  mockStorage.saveSideDishes(sides);
  
  return adminClient.success(newDish);
}

export async function updateSideDish(id: string, dishData: Partial<SideDish>): Promise<ApiResponse<SideDish>> {
  // --- 실제 API (주석 처리) ---
  /*
  // fetch PATCH /admin/side-dishes/{id}...
  */

  await new Promise((resolve) => setTimeout(resolve, 300));
  const sides = mockStorage.getSideDishes();
  const index = sides.findIndex((s) => s.id === id);
  if (index === -1) {
    return adminClient.error("NOT_FOUND", "해당 기본찬을 찾을 수 없습니다.");
  }

  const updatedDish = {
    ...sides[index],
    ...dishData,
    updated_at: new Date().toISOString(),
  } as SideDish;

  sides[index] = updatedDish;
  mockStorage.saveSideDishes(sides);
  
  return adminClient.success(updatedDish);
}

export async function deleteSideDish(id: string): Promise<ApiResponse<{ message: string; deleted_id: string }>> {
  // --- 실제 API (주석 처리) ---
  /*
  // fetch DELETE /admin/side-dishes/{id}...
  */

  await new Promise((resolve) => setTimeout(resolve, 200));
  let sides = mockStorage.getSideDishes();
  const exists = sides.some((s) => s.id === id);
  if (!exists) {
    return adminClient.error("NOT_FOUND", "해당 기본찬을 찾을 수 없습니다.");
  }

  sides = sides.filter((s) => s.id !== id);
  mockStorage.saveSideDishes(sides);
  
  return adminClient.success({
    message: "기본찬이 삭제되었습니다.",
    deleted_id: id,
  });
}

export async function reorderSideDishes(orders: ReorderItem[]): Promise<ApiResponse<{ message: string; updated_count: number }>> {
  // --- 실제 API (주석 처리) ---
  /*
  // fetch PATCH /admin/side-dishes/reorder...
  */

  await new Promise((resolve) => setTimeout(resolve, 300));
  const sides = mockStorage.getSideDishes();
  
  orders.forEach((order) => {
    const dish = sides.find((s) => s.id === order.id);
    if (dish) {
      dish.sort_order = order.sort_order;
      dish.updated_at = new Date().toISOString();
    }
  });

  mockStorage.saveSideDishes(sides);

  return adminClient.success({
    message: "기본찬 순서가 변경되었습니다.",
    updated_count: orders.length,
  });
}
