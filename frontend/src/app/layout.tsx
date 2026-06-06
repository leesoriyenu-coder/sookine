import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/common/Toast/ToastProvider";
import { LightboxProvider } from "@/components/common/Lightbox/LightboxProvider";

export const metadata: Metadata = {
  title: "숙이네국수 — 엄마가 정성스럽게 차려주는 집밥 한 상차림",
  description: "경남 진주 신안로 로컬 맛집 숙이네국수. 갈치조림, 두루치기 등 집밥 한 상차림. 영업시간, 메뉴, 위치 안내.",
  keywords: ["숙이네국수", "진주맛집", "갈치조림", "두루치기", "진주 신안로", "로컬 맛집"],
  openGraph: {
    type: "website",
    title: "숙이네국수 — 엄마가 정성스럽게 차려주는 집밥 한 상차림",
    description: "경남 진주 신안로 로컬 맛집 숙이네국수. 갈치조림, 두루치기 등 집밥 한 상차림. 영업시간, 메뉴, 위치 안내.",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "숙이네국수 — 엄마가 정성스럽게 차려주는 집밥 한 상차림",
    description: "경남 진주 신안로 로컬 맛집 숙이네국수. 갈치조림, 두루치기 등 집밥 한 상차림. 영업시간, 메뉴, 위치 안내.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <ToastProvider>
          <LightboxProvider>
            {children}
          </LightboxProvider>
        </ToastProvider>
      </body>
    </html>
  );
}

