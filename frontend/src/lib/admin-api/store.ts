import { ApiResponse } from "@/types/api";
import { StoreInfo, StoreStatus } from "@/types/store";
import { adminClient } from "./client";

export async function updateStoreInfo(info: Partial<StoreInfo>): Promise<ApiResponse<StoreInfo>> {
  return adminClient.patch<StoreInfo>("/store-info", info);
}

export async function updateStoreStatus(status: StoreStatus): Promise<ApiResponse<{ status: StoreStatus; updated_at: string }>> {
  return adminClient.patch<{ status: StoreStatus; updated_at: string }>("/store-status", { status });
}
