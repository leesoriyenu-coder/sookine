import React from "react";
import { getStoreInfo } from "@/lib/api/store";
import { getMenusByCategory } from "@/lib/api/menus";
import { getUrgentNotice, getNotices } from "@/lib/api/notices";
import { getSideDishes } from "@/lib/api/side-dishes";

import { HeroSection } from "@/components/sections/HeroSection/HeroSection";
import { StorySection } from "@/components/sections/StorySection/StorySection";
import { MenuSection } from "@/components/sections/MenuSection/MenuSection";
import { InfoSection } from "@/components/sections/InfoSection/InfoSection";
import { LocationSection } from "@/components/sections/LocationSection/LocationSection";
import { NoticeSection } from "@/components/sections/NoticeSection/NoticeSection";
import { Footer } from "@/components/sections/Footer/Footer";
import { FloatingCallButton } from "@/components/layout/FloatingCallButton/FloatingCallButton";

// Next.js App Router Page
export default async function MainPage() {
  // 1. 서버 사이드 데이터 패칭 (초기값 가져오기)
  const storeInfo = await getStoreInfo();
  const groupedMenus = await getMenusByCategory();
  const urgentNotice = await getUrgentNotice();
  const sideDishes = await getSideDishes();
  
  // 공지사항 최근 5건
  const noticesRes = await getNotices(5, 0);
  const initialNotices = noticesRes.success && noticesRes.data ? noticesRes.data : [];
  const totalNoticesCount = noticesRes.success && noticesRes.meta.pagination ? noticesRes.meta.pagination.total : 0;

  return (
    <main>
      {/* 2. 섹션 렌더링 */}
      <HeroSection storeInfo={storeInfo} urgentNotice={urgentNotice} />
      
      <StorySection />
      
      <MenuSection groupedMenus={groupedMenus} sideDishes={sideDishes} />
      
      <InfoSection storeInfo={storeInfo} />
      
      <LocationSection storeInfo={storeInfo} />
      
      <NoticeSection initialNotices={initialNotices} totalCount={totalNoticesCount} />
      
      <Footer storeInfo={storeInfo} />

      {/* 3. 모바일 하단 플로팅 전화 버튼 */}
      <FloatingCallButton initialPhone={storeInfo.phone} />
    </main>
  );
}
