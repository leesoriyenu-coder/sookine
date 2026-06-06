export interface ApiError {
  code: string;
  message: string;
}

export interface MetaInfo {
  timestamp: string;
  pagination?: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  limit: number;
  offset: number;
  has_next: boolean;
}

export type ApiResponse<T> = 
  | { success: true; data: T; meta: MetaInfo; error?: never }
  | { success: false; data?: never; meta: MetaInfo; error: ApiError };

export type PaginatedResponse<T> = ApiResponse<T[]>;
