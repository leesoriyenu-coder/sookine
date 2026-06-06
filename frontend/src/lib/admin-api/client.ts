import { ApiResponse } from "@/types/api";

const BASE_URL = "/api/admin";

export const adminClient = {
  // 실제 API 헤더 및 토큰 헬퍼
  getHeaders(): HeadersInit {
    const token = typeof window !== "undefined" ? localStorage.getItem("sookine_session_token") : "";
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    };
  },

  // 성공 응답 포맷터
  success<T>(data: T): ApiResponse<T> {
    return {
      success: true,
      data,
      meta: { timestamp: new Date().toISOString() }
    };
  },

  // 에러 응답 포맷터
  error(code: string, message: string): ApiResponse<any> {
    return {
      success: false,
      meta: { timestamp: new Date().toISOString() },
      error: { code, message }
    };
  },

  // GET 요청
  async get<T>(path: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${BASE_URL}${path}`, {
        method: "GET",
        headers: this.getHeaders()
      });
      if (response.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("sookine_session_token");
          window.location.href = "/admin/login";
        }
      }
      return await response.json();
    } catch (err: any) {
      return this.error("INTERNAL_ERROR", err.message || "서버 통신 실패");
    }
  },

  // POST 요청
  async post<T>(path: string, body: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${BASE_URL}${path}`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(body)
      });
      if (response.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("sookine_session_token");
          window.location.href = "/admin/login";
        }
      }
      return await response.json();
    } catch (err: any) {
      return this.error("INTERNAL_ERROR", err.message || "서버 통신 실패");
    }
  },

  // PATCH 요청
  async patch<T>(path: string, body: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${BASE_URL}${path}`, {
        method: "PATCH",
        headers: this.getHeaders(),
        body: JSON.stringify(body)
      });
      if (response.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("sookine_session_token");
          window.location.href = "/admin/login";
        }
      }
      return await response.json();
    } catch (err: any) {
      return this.error("INTERNAL_ERROR", err.message || "서버 통신 실패");
    }
  },

  // DELETE 요청
  async del<T>(path: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${BASE_URL}${path}`, {
        method: "DELETE",
        headers: this.getHeaders()
      });
      if (response.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("sookine_session_token");
          window.location.href = "/admin/login";
        }
      }
      return await response.json();
    } catch (err: any) {
      return this.error("INTERNAL_ERROR", err.message || "서버 통신 실패");
    }
  },

  // 파일 업로드 요청
  async upload<T>(path: string, formData: FormData): Promise<ApiResponse<T>> {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("sookine_session_token") : "";
      const response = await fetch(`${BASE_URL}${path}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });
      if (response.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("sookine_session_token");
          window.location.href = "/admin/login";
        }
      }
      return await response.json();
    } catch (err: any) {
      return this.error("INTERNAL_ERROR", err.message || "서버 통신 실패");
    }
  }
};
export const dynamic = "force-dynamic";
