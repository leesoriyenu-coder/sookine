"use client";

import React, { useEffect, useState } from "react";
import styles from "./Footer.module.css";
import { StoreInfo } from "@/types/store";
import Link from "next/link";

interface FooterProps {
  storeInfo: StoreInfo;
}

export const Footer = ({ storeInfo: initialStoreInfo }: FooterProps) => {
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

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.content}>
          <div className={styles.left}>
            <h3 className={styles.restaurantName}>숙이네국수</h3>
            <p className={styles.infoLine}>
              주소: {storeInfo.address_road} {storeInfo.address_jibun ? `(${storeInfo.address_jibun})` : ""} <br />
              전화번호: {storeInfo.phone} <br />
              정기 휴무일: {storeInfo.regular_holiday || "매주 일요일"}
            </p>
          </div>
          <div className={styles.right}>
            <div className={styles.externalLinks}>
              <a href="https://map.naver.com/v5/search/%EA%B2%BD%EC%83%81%EB%82%A8%EB%8F%84%20%EC%A7%84%EC%A3%BC%EC%8B%9C%20%EC%8B%A0%EC%95%90%EB%A1%9C%20161%20%EC%85%A1%EC%9D%B4%EB%84%A4%EA%B5%AD%EC%88%98" target="_blank" rel="noopener noreferrer" className={styles.linkItem}>
                📍 네이버 지도
              </a>
              <a href="https://www.youtube.com/watch?v=F3P_7_8v364" target="_blank" rel="noopener noreferrer" className={styles.linkItem}>
                📺 또간집 진주편
              </a>
              <a href="https://www.daangn.com/kr/local-profile/%EC%88%99%EC%9D%B4%EB%84%A4%EA%B5%AD%EC%88%98-ocvk2orvbi7t/" target="_blank" rel="noopener noreferrer" className={styles.linkItem}>
                🥕 당근마켓 프로필
              </a>
            </div>
            <div className={styles.adminRow}>
              <Link href="/admin" className={styles.adminLink}>
                관리자 로그인
              </Link>
            </div>
            <p className={styles.copyright}>
              © {new Date().getFullYear()} 숙이네국수. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
