import { ApiResponse } from "@/types/api";
import { UploadResult } from "@/types/admin";
import { adminClient } from "./client";

export async function uploadImage(file: File, bucket: string): Promise<ApiResponse<UploadResult>> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("bucket", bucket);
  
  return adminClient.upload<UploadResult>("/upload", formData);
}
export const dynamic = "force-dynamic";
