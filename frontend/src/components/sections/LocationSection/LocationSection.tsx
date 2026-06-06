"use client";

import React, { useEffect, useState } from "react";
import styles from "./LocationSection.module.css";
import { StoreInfo } from "@/types/store";
import { MapPin, Phone, Compass, ExternalLink } from "lucide-react";
import { ScrollReveal } from "../../common/ScrollReveal/ScrollReveal";
import { Button } from "../../common/Button/Button";
import { NaverMap } from "./NaverMap";

interface LocationSectionProps {
  storeInfo: StoreInfo;
}

export const LocationSection = ({ storeInfo: initialStoreInfo }: LocationSectionProps) => {
  const [storeInfo, setStoreInfo] = useState<StoreInfo>(initialStoreInfo);

  // 데모 상태 연동
  useEffect(() => {
    const syncStoreInfo = () => {
      if (typeof window !== "undefined") {
        const localStore = window.localStorage.getItem("sookine_store_info");
        if (localStore) {
          setStoreInfo(JSON.parse(localStore));
        }
      }
    };

    window.addEventListener("storage", syncStoreInfo);
    window.addEventListener("focus", syncStoreInfo);
    return () => {
      window.removeEventListener("storage", syncStoreInfo);
      window.removeEventListener("focus", syncStoreInfo);
    };
  }, []);

  const handleExternalMap = () => {
    const encodedQuery = encodeURIComponent(storeInfo.address_road + " 숙이네국수");
    window.open(`https://map.naver.com/v5/search/${encodedQuery}`, "_blank", "noopener,noreferrer");
  };

  return (
    <section id="location" className={styles.locationSection}>
      <div className="container">
        <ScrollReveal>
          <div className={styles.sectionHeader}>
            <span className={styles.subTitle}>찾아오시는 길</span>
            <h2 className={styles.title}>매장 위치 안내</h2>
          </div>
        </ScrollReveal>

        <div className={styles.layout}>
          {/* 주소 및 길찾기 액션 영역 */}
          <ScrollReveal delay={50}>
            <div className={styles.addressDetails}>
              {/* 도로명 주소 */}
              <div className={styles.addressItem}>
                <div className={styles.iconWrapper}>
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className={styles.label}>도로명 주소</h4>
                  <p className={styles.value}>{storeInfo.address_road}</p>
                  {storeInfo.address_jibun && (
                    <p className={styles.jibun}>지번: {storeInfo.address_jibun}</p>
                  )}
                </div>
              </div>

              {/* 매장 전화번호 */}
              <div className={styles.addressItem}>
                <div className={styles.iconWrapper}>
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className={styles.label}>전화번호</h4>
                  <p className={styles.value}>
                    <a href={`tel:${storeInfo.phone.replace(/[^0-9]/g, "")}`} className={styles.phoneLink}>
                      {storeInfo.phone}
                    </a>
                  </p>
                  <p className={styles.jibun}>모바일에서 터치 시 바로 연결됩니다.</p>
                </div>
              </div>

              {/* 액션 버튼 */}
              <div className={styles.actions}>
                <a href={`tel:${storeInfo.phone.replace(/[^0-9]/g, "")}`}>
                  <Button variant="primary" fullWidth>
                    <Phone size={18} style={{ marginRight: "8px" }} />
                    매장에 전화 걸기
                  </Button>
                </a>
                <Button variant="secondary" fullWidth onClick={handleExternalMap}>
                  <Compass size={18} style={{ marginRight: "8px" }} />
                  네이버 지도에서 길찾기
                  <ExternalLink size={14} style={{ marginLeft: "6px" }} />
                </Button>
              </div>
            </div>
          </ScrollReveal>

          {/* 지도 뷰 영역 */}
          <ScrollReveal delay={150}>
            <div className={styles.mapWrapper}>
              <NaverMap addressRoad={storeInfo.address_road} />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};
