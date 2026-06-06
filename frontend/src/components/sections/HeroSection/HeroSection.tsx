"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./HeroSection.module.css";
import { ChevronDown } from "lucide-react";
import { StoreInfo } from "@/types/store";
import { Notice } from "@/types/notice";
import { StatusBadge } from "../../common/StatusBadge/StatusBadge";
import { UrgentBanner } from "./UrgentBanner";
import { cn } from "@/lib/utils/cn";

interface HeroSectionProps {
  storeInfo: StoreInfo;
  urgentNotice: Notice | null;
}

export const HeroSection = ({ storeInfo: initialStoreInfo, urgentNotice: initialUrgentNotice }: HeroSectionProps) => {
  const [storeInfo, setStoreInfo] = useState<StoreInfo>(initialStoreInfo);
  const [urgentNotice, setUrgentNotice] = useState<Notice | null>(initialUrgentNotice);
  const [isBannerVisible, setIsBannerVisible] = useState(!!initialUrgentNotice);

  // 데모 상태 연동: localStorage 업데이트 시 상태 동기화
  useEffect(() => {
    const handleStorageChange = () => {
      if (typeof window !== "undefined") {
        const localStore = window.localStorage.getItem("sookine_store_info");
        if (localStore) {
          setStoreInfo(JSON.parse(localStore));
        }
        const localNotices = window.localStorage.getItem("sookine_notices");
        if (localNotices) {
          const notices: Notice[] = JSON.parse(localNotices);
          const urgent = notices.find((n) => n.is_urgent && n.is_visible);
          setUrgentNotice(urgent || null);
          setIsBannerVisible(!!urgent);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    // 페이지 포커스 시 상태 최신화
    window.addEventListener("focus", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleStorageChange);
    };
  }, []);

  const handleScrollDown = () => {
    const storySection = document.getElementById("story");
    if (storySection) {
      storySection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {urgentNotice && (
        <UrgentBanner 
          notice={urgentNotice} 
          onClose={() => setIsBannerVisible(false)} 
        />
      )}
      <header className={cn(styles.hero, isBannerVisible && styles.heroWithBanner)}>
        {/* 데스크톱 배경 이미지 최적화 */}
        <div className={styles.desktopImageContainer}>
          <Image
            src="/images/hero-desktop.png"
            alt="숙이네국수 매장 전경 데스크톱"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover" }}
          />
        </div>
        
        {/* 모바일 배경 이미지 최적화 */}
        <div className={styles.mobileImageContainer}>
          <Image
            src="/images/hero-mobile.png"
            alt="숙이네국수 매장 전경 모바일"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover" }}
          />
        </div>

        <div className={styles.heroOverlay} />
        
        <div className={styles.heroContent}>
          <p className={styles.slogan}>{storeInfo.slogan || "엄마가 정성스럽게 차려주는 집밥 한 상차림"}</p>
          <h1 className={styles.logoText}>숙이네국수</h1>
          
          <div className={styles.statusWrapper}>
            <StatusBadge status={storeInfo.status} size="lg" />
          </div>
        </div>

        <div className={styles.scrollIndicator} onClick={handleScrollDown}>
          <span>이야기 둘러보기</span>
          <ChevronDown size={24} className={styles.scrollArrow + " animate-bounce"} />
        </div>
      </header>
    </>
  );
};
