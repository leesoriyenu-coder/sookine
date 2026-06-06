import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("sookine_session_token")?.value;
  const { pathname } = request.nextUrl;

  // 관리자 권한이 필요한 경로 검사 (단, /admin/login은 예외)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    // 세션 토큰 쿠키가 없는 경우 로그인 페이지로 리다이렉트
    if (!token) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// 05_frontend_architecture.md의 매처 매핑 설정 준수
// login 경로와 정적 파일을 제외한 모든 /admin 하위 경로
export const config = {
  matcher: ["/admin/((?!login).*)"],
};
