import { ApiResponse } from "@/types/api";
import { StoreInfo, StoreStatus } from "@/types/store";
import { adminClient } from "./client";
import { mockStorage } from "../api/mockData";

export async function updateStoreInfo(info: Partial<StoreInfo>): Promise<ApiResponse<StoreInfo>> {
  // --- 실제 Supabase Edge Function 호출 (주석 처리) ---
  /*
  // fetch PATCH /admin/store-info...
  */

  // --- 데모용 Mock 매장 정보 업데이트 ---
  await new Promise((resolve) => setTimeout(resolve, 300));
  const current = mockStorage.getStoreInfo();
  const updated = {
    ...current,
    ...info,
    updated_at: new Date().toISOString()
  } as StoreInfo;
  
  mockStorage.saveStoreInfo(updated);
  return adminClient.success(updated);
}

export async function updateStoreStatus(status: StoreStatus): Promise<ApiResponse<{ status: StoreStatus; updated_at: string }>> {
  // --- 실제 Supabase Edge Function 호출 (주석 처리) ---
  /*
  // fetch PATCH /admin/store-status...
  */

  // --- 데모용 Mock 매장 상태 토글 ---
  await new Promise((resolve) => setTimeout(resolve, 200));
  const current = mockStorage.getStoreInfo();
  const updated = {
    ...current,
    status,
    updated_at: new Date().toISOString()
  };
  
  mockStorage.saveStoreInfo(updated);
  
  return adminClient.success({
    status,
    updated_at: updated.updated_at
  });
}
