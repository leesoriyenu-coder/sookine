export interface LoginRequest {
  password: string;
}

export interface LoginResponse {
  session_token: string;
  expires_at: string;
}

export interface ReorderItem {
  id: string;
  sort_order: number;
}

export interface UploadResult {
  url: string;
  path: string;
}
