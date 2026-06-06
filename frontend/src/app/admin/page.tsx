"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { getStoreInfo } from "@/lib/api/store";
import { getNotices } from "@/lib/api/notices";
import { StoreInfo } from "@/types/store";
import { Notice } from "@/types/notice";
import { StatusToggle } from "@/components/admin/StatusToggle/StatusToggle";
import { Card } from "@/components/common/Card/Card";
import styles from "./admin.module.css";
import {
  UtensilsCrossed,
  Megaphone,
  ChefHat,
  Store,
  ArrowRight,
  ClipboardList,
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  
  const [storeInfo, setStoreInfo] = useState<StoreInfo | null>(null);
  const [recentNotices, setRecentNotices] = useState<Notice[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // 1. 인증 체크
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/admin/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // 2. 초기 데이터 페칭
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const fetchData = async () => {
      setLoadingData(true);
      try {
        const info = await getStoreInfo();
        setStoreInfo(info);
        
        const noticesRes = await getNotices(3, 0);
        if (noticesRes.success && noticesRes.data) {
          setRecentNotices(noticesRes.data);
        }
      } catch (e) {
        console.error("Dashboard data load error:", e);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  if (isLoading || !isAuthenticated || loadingData) {
    return (
      <div style={{ display: "flex", height: "80vh", alignItems: "center", justifyContent: "center" }}>
        <div className="animate-pulse" style={{ color: "var(--color-text-secondary)" }}>
          운영 데이터 불러오는 중...
        </div>
      </div>
    );
  }

  const adminMenuCards = [
    {
      title: "메뉴 관리",
      desc: "갈치조림, 두루치기 등 대표/일반 식사 메뉴 가격 및 사진을 편집합니다.",
      href: "/admin/menus",
      icon: UtensilsCrossed,
      color: "rgba(196, 85, 58, 0.1)",
      textColor: "var(--color-cta)",
    },
    {
      title: "공지사항 관리",
      desc: "휴무 일정 변경, 신메뉴 출시 등 새로운 소식을 등록하고 배너를 활성화합니다.",
      href: "/admin/notices",
      icon: Megaphone,
      color: "rgba(220, 38, 38, 0.1)",
      textColor: "var(--color-admin-error)",
    },
    {
      title: "기본찬 관리",
      desc: "새벽 시장에서 가져와 매일 바뀌는 밑반찬 갤러리를 관리합니다.",
      href: "/admin/side-dishes",
      icon: ChefHat,
      color: "rgba(107, 142, 90, 0.1)",
      textColor: "var(--color-seasonal)",
    },
    {
      title: "매장 정보 수정",
      desc: "영업 시간 설정, 전화번호, 주소, 주차 정보, 결제 방식 등을 수정합니다.",
      href: "/admin/store-info",
      icon: Store,
      color: "rgba(212, 168, 83, 0.1)",
      textColor: "var(--color-accent)",
    },
  ];

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>식당 운영 현황판</h1>
      </div>

      {/* 실시간 영업 상태 토글 배너 */}
      {storeInfo && (
        <StatusToggle 
          currentStatus={storeInfo.status} 
          onStatusChange={(status) => setStoreInfo(prev => prev ? { ...prev, status } : null)}
        />
      )}

      {/* 리소스 편집 카드 리스트 */}
      <h3 style={{ fontSize: "var(--text-lg)", fontWeight: "var(--font-bold)", marginBottom: "var(--space-4)" }}>
        매장 정보 관리
      </h3>
      <div className={styles.grid} style={{ marginBottom: "var(--space-10)" }}>
        {adminMenuCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link href={card.href} key={card.href}>
              <Card style={{ display: "flex", flexDirection: "column", height: "100%", cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                  <div style={{ 
                    width: "40px", 
                    height: "40px", 
                    borderRadius: "8px", 
                    backgroundColor: card.color, 
                    color: card.textColor, 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center" 
                  }}>
                    <Icon size={20} />
                  </div>
                  <h4 style={{ fontSize: "var(--text-base)", fontWeight: "var(--font-bold)" }}>{card.title}</h4>
                </div>
                <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", flexGrow: 1, marginBottom: "16px", lineHeight: "1.4" }}>
                  {card.desc}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "var(--text-xs)", color: "var(--color-accent)", fontWeight: "var(--font-semibold)", marginTop: "auto" }}>
                  바로가기
                  <ArrowRight size={12} />
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* 최근 등록된 공지사항 요약 */}
      <div style={{ backgroundColor: "var(--color-bg-secondary)", border: "var(--border-default)", borderRadius: "var(--radius-lg)", padding: "var(--space-6)", boxShadow: "var(--shadow-md)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h3 style={{ fontSize: "var(--text-base)", fontWeight: "var(--font-bold)", display: "flex", alignItems: "center", gap: "8px" }}>
            <ClipboardList size={18} />
            최근 등록된 공지사항
          </h3>
          <Link href="/admin/notices" style={{ fontSize: "var(--text-xs)", color: "var(--color-accent)", fontWeight: "var(--font-semibold)" }}>
            전체 관리
          </Link>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {recentNotices.length > 0 ? (
            recentNotices.map((notice) => (
              <div 
                key={notice.id} 
                style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center", 
                  padding: "10px 12px", 
                  backgroundColor: "var(--color-bg-primary)", 
                  borderRadius: "6px",
                  borderLeft: notice.is_urgent ? "4px solid var(--color-admin-error)" : "none"
                }}
              >
                <div>
                  <h4 style={{ fontSize: "var(--text-sm)", fontWeight: "var(--font-bold)", color: "var(--color-text-primary)" }}>
                    {notice.is_urgent && "⚠️ [긴급] "}
                    {notice.title}
                  </h4>
                  <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", marginTop: "2px" }}>
                    {notice.content.substring(0, 50)}...
                  </p>
                </div>
                <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", fontFamily: "var(--font-mono)" }}>
                  {new Date(notice.created_at).toLocaleDateString()}
                </span>
              </div>
            ))
          ) : (
            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", textAlign: "center", padding: "12px 0" }}>
              등록된 공지사항이 없습니다.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
