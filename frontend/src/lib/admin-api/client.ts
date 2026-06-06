import { ApiResponse, MetaInfo } from "@/types/api";

const BASE_URL = typeof process !== "undefined" ? process.env.NEXT_PUBLIC_SUPABASE_URL + "/functions/v1" : "";

export const adminClient = {
  // 실제 API 헤더 및 토큰 헬퍼
  /*
  getHeaders(): HeadersInit {
    const token = typeof window !== "undefined" ? localStorage.getItem("sookine_session_token") : "";
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    };
  },
  */

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

  // GET 요청 모사/실제
  async get<T>(path: string): Promise<ApiResponse<T>> {
    /*
    try {
      const response = await fetch(`${BASE_URL}${path}`, {
        method: "GET",
        headers: this.getHeaders()
      });
      if (response.status === 401) {
        // 401 Unauthorized 시 자동 로그아웃 및 리다이렉트 처리 로직
        if (typeof window !== "undefined") {
          localStorage.removeItem("sookine_session_token");
          window.location.href = "/admin/login";
        }
      }
      return await response.json();
    } catch (err: any) {
      return this.error("INTERNAL_ERROR", err.message || "서버 통신 실패");
    }
    */
    return this.error("NOT_IMPLEMENTED", "클라이언트 모조 메소드 호출");
  }
};
