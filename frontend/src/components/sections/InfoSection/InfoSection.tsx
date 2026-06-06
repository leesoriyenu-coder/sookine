"use client";

import React, { useEffect, useState } from "react";
import styles from "./InfoSection.module.css";
import { StoreInfo } from "@/types/store";
import { Clock, Calendar, Car, CreditCard, AlertCircle } from "lucide-react";
import { ScrollReveal } from "../../common/ScrollReveal/ScrollReveal";
import { Card } from "../../common/Card/Card";

interface InfoSectionProps {
  storeInfo: StoreInfo;
}

export const InfoSection = ({ storeInfo: initialStoreInfo }: InfoSectionProps) => {
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

  // 시간 포맷팅 헬퍼 (HH:MM -> 오전/오후 HH:MM)
  const formatTime = (timeStr: string) => {
    if (!timeStr) return "";
    const [hourStr, minuteStr] = timeStr.split(":");
    const hour = parseInt(hourStr);
    const ampm = hour >= 12 ? "오후" : "오전";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${ampm} ${displayHour}:${minuteStr}`;
  };

  return (
    <section id="info" className={styles.infoSection}>
      <div className="container">
        <ScrollReveal>
          <div className={styles.sectionHeader}>
            <span className={styles.subTitle}>이용 안내</span>
            <h2 className={styles.title}>오시기 전에 확인해 주세요</h2>
          </div>
        </ScrollReveal>

        <div className={styles.infoGrid}>
          {/* 1. 영업시간 카드 */}
          <ScrollReveal delay={50}>
            <Card className="height-100">
              <div className={styles.cardContent}>
                <div className={styles.iconWrapper}>
                  <Clock size={20} />
                </div>
                <div className={styles.textWrapper}>
                  <h3 className={styles.cardTitle}>영업시간</h3>
                  <ul className={styles.cardList}>
                    <li className={styles.cardListItem}>
                      <strong>문 여는 시간:</strong> {formatTime(storeInfo.open_time)}
                    </li>
                    <li className={styles.cardListItem}>
                      <strong>쉬는 시간:</strong> {formatTime(storeInfo.break_start)} ~ {formatTime(storeInfo.break_end)}
                    </li>
                    <li className={styles.cardListItem}>
                      <strong>주문 마감:</strong> {storeInfo.last_order ? formatTime(storeInfo.last_order) : "영업 종료 30분 전"}
                    </li>
                    <li className={styles.cardListItem}>
                      <strong>문 닫는 시간:</strong> {formatTime(storeInfo.close_time)}
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </ScrollReveal>

          {/* 2. 휴무일 카드 */}
          <ScrollReveal delay={100}>
            <Card className="height-100">
              <div className={styles.cardContent}>
                <div className={styles.iconWrapper}>
                  <Calendar size={20} />
                </div>
                <div className={styles.textWrapper}>
                  <h3 className={styles.cardTitle}>정기 휴무</h3>
                  <ul className={styles.cardList}>
                    <li className={styles.cardListItem} style={{ fontSize: "var(--text-lg)", color: "var(--color-cta)", fontWeight: "var(--font-bold)" }}>
                      {storeInfo.regular_holiday || "매주 일요일"}
                    </li>
                    <li className={styles.cardListItem} style={{ color: "var(--color-text-secondary)" }}>
                      <strong style={{ color: "var(--color-cta)", display: "block", marginBottom: "4px" }}>⚠️ 방문 전 전화 확인 권장</strong>
                      사장님 출장이나 개인 사정에 의한 비정기 임시 휴무가 있을 수 있으니, 멀리서 오시는 경우 방문 전에 확인 전화를 주시는 것을 권장합니다.
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </ScrollReveal>

          {/* 3. 주차 안내 카드 */}
          <ScrollReveal delay={150}>
            <Card className="height-100">
              <div className={styles.cardContent}>
                <div className={styles.iconWrapper}>
                  <Car size={20} />
                </div>
                <div className={styles.textWrapper}>
                  <h3 className={styles.cardTitle}>주차 안내</h3>
                  <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", lineHeight: "var(--leading-normal)" }}>
                    {storeInfo.parking_info || "전용 주차장이 없습니다. 가게 근처 이현상가 주변 혹은 골목 주차를 부탁드립니다."}
                  </p>
                </div>
              </div>
            </Card>
          </ScrollReveal>

          {/* 4. 결제 및 유의사항 카드 */}
          <ScrollReveal delay={200}>
            <Card className="height-100">
              <div className={styles.cardContent}>
                <div className={styles.iconWrapper}>
                  <CreditCard size={20} />
                </div>
                <div className={styles.textWrapper}>
                  <h3 className={styles.cardTitle}>결제수단 및 유의사항</h3>
                  <ul className={styles.cardList} style={{ marginBottom: "var(--space-3)" }}>
                    {storeInfo.caution_notes.map((note, idx) => (
                      <li key={idx} className={styles.cardListItem}>
                        {note}
                      </li>
                    ))}
                  </ul>
                  <h4 style={{ fontSize: "var(--text-sm)", fontWeight: "var(--font-bold)", color: "var(--color-text-primary)", marginBottom: "4px" }}>
                    이용 가능한 결제수단:
                  </h4>
                  <div className={styles.methodsList}>
                    {storeInfo.payment_methods.map((method, idx) => (
                      <span key={idx} className={styles.methodBadge}>
                        {method}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};
