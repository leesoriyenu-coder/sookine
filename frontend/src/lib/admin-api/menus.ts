import { ApiResponse } from "@/types/api";
import { Menu } from "@/types/menu";
import { ReorderItem } from "@/types/admin";
import { adminClient } from "./client";
import { mockStorage } from "../api/mockData";

export async function adminGetMenus(): Promise<ApiResponse<Menu[]>> {
  // --- 실제 API (주석 처리) ---
  /*
  // fetch GET /admin/menus...
  */

  await new Promise((resolve) => setTimeout(resolve, 200));
  return adminClient.success(mockStorage.getMenus());
}

export async function createMenu(menuData: Omit<Menu, "id" | "created_at" | "updated_at">): Promise<ApiResponse<Menu>> {
  // --- 실제 API (주석 처리) ---
  /*
  // fetch POST /admin/menus...
  */

  await new Promise((resolve) => setTimeout(resolve, 300));
  const menus = mockStorage.getMenus();
  
  // 비즈니스 룰 검증
  if (menuData.is_signature && menuData.category !== "signature") {
    return adminClient.error("VALIDATION_ERROR", "대표 메뉴인 경우 카테고리는 signature이어야 합니다.");
  }
  if (menuData.is_seasonal && menuData.category !== "seasonal") {
    return adminClient.error("VALIDATION_ERROR", "시즌 메뉴인 경우 카테고리는 seasonal이어야 합니다.");
  }

  const newMenu: Menu = {
    ...menuData,
    id: "menu-" + Math.random().toString(36).substring(2, 9),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  menus.push(newMenu);
  mockStorage.saveMenus(menus);
  
  return adminClient.success(newMenu);
}

export async function updateMenu(id: string, menuData: Partial<Menu>): Promise<ApiResponse<Menu>> {
  // --- 실제 API (주석 처리) ---
  /*
  // fetch PATCH /admin/menus/{id}...
  */

  await new Promise((resolve) => setTimeout(resolve, 300));
  const menus = mockStorage.getMenus();
  const index = menus.findIndex((m) => m.id === id);
  if (index === -1) {
    return adminClient.error("NOT_FOUND", "해당 메뉴를 찾을 수 없습니다.");
  }

  const updatedMenu = {
    ...menus[index],
    ...menuData,
    updated_at: new Date().toISOString(),
  } as Menu;

  // 비즈니스 룰 검증
  if (updatedMenu.is_signature && updatedMenu.category !== "signature") {
    return adminClient.error("VALIDATION_ERROR", "대표 메뉴인 경우 카테고리는 signature이어야 합니다.");
  }
  if (updatedMenu.is_seasonal && updatedMenu.category !== "seasonal") {
    return adminClient.error("VALIDATION_ERROR", "시즌 메뉴인 경우 카테고리는 seasonal이어야 합니다.");
  }

  menus[index] = updatedMenu;
  mockStorage.saveMenus(menus);
  
  return adminClient.success(updatedMenu);
}

export async function deleteMenu(id: string): Promise<ApiResponse<{ message: string; deleted_id: string }>> {
  // --- 실제 API (주석 처리) ---
  /*
  // fetch DELETE /admin/menus/{id}...
  */

  await new Promise((resolve) => setTimeout(resolve, 200));
  let menus = mockStorage.getMenus();
  const exists = menus.some((m) => m.id === id);
  if (!exists) {
    return adminClient.error("NOT_FOUND", "해당 메뉴를 찾을 수 없습니다.");
  }

  menus = menus.filter((m) => m.id !== id);
  mockStorage.saveMenus(menus);
  
  return adminClient.success({
    message: "메뉴가 삭제되었습니다.",
    deleted_id: id,
  });
}

export async function reorderMenus(orders: ReorderItem[]): Promise<ApiResponse<{ message: string; updated_count: number }>> {
  // --- 실제 API (주석 처리) ---
  /*
  // fetch PATCH /admin/menus/reorder...
  */

  await new Promise((resolve) => setTimeout(resolve, 300));
  const menus = mockStorage.getMenus();
  
  orders.forEach((order) => {
    const menu = menus.find((m) => m.id === order.id);
    if (menu) {
      menu.sort_order = order.sort_order;
      menu.updated_at = new Date().toISOString();
    }
  });

  mockStorage.saveMenus(menus);

  return adminClient.success({
    message: "메뉴 순서가 변경되었습니다.",
    updated_count: orders.length,
  });
}
