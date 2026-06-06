"use client";

import React, { useEffect, useState, useCallback } from "react";
import styles from "./NoticeSection.module.css";
import { Notice } from "@/types/notice";
import { getNotices } from "@/lib/api/notices";
import { ScrollReveal } from "../../common/ScrollReveal/ScrollReveal";
import { NoticeCard } from "./NoticeCard";
import { Button } from "../../common/Button/Button";

interface NoticeSectionProps {
  initialNotices: Notice[];
  totalCount: number;
}

export const NoticeSection = ({ 
  initialNotices, 
  totalCount: initialTotal 
}: NoticeSectionProps) => {
  const [notices, setNotices] = useState<Notice[]>(initialNotices);
  const [totalCount, setTotalCount] = useState(initialTotal);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const LIMIT = 5;

  // 데이터 리셋 및 1페이지 갱신 (데모 데이터 변경 시 대응)
  const refreshNotices = useCallback(async () => {
    setLoading(true);
    const res = await getNotices(LIMIT, 0);
    if (res.success && res.data) {
      setNotices(res.data);
      setTotalCount(res.meta.pagination?.total || 0);
      setOffset(0);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    window.addEventListener("storage", refreshNotices);
    window.addEventListener("focus", refreshNotices);
    return () => {
      window.removeEventListener("storage", refreshNotices);
      window.removeEventListener("focus", refreshNotices);
    };
  }, [refreshNotices]);

  const handleLoadMore = async () => {
    if (loading) return;
    setLoading(true);
    const nextOffset = offset + LIMIT;
    const res = await getNotices(LIMIT, nextOffset);
    if (res.success && res.data) {
      setNotices((prev) => [...prev, ...(res.data || [])]);
      setOffset(nextOffset);
    }
    setLoading(false);
  };

  const hasNext = notices.length < totalCount;

  return (
    <section id="notice" className={styles.noticeSection}>
      <div className="container">
        <ScrollReveal>
          <div className={styles.sectionHeader}>
            <span className={styles.subTitle}>알려드립니다</span>
            <h2 className={styles.title}>숙이네 소식 & 공지</h2>
          </div>
        </ScrollReveal>

        <div className={styles.noticeList}>
          {notices.length > 0 ? (
            notices.map((notice, idx) => (
              <ScrollReveal key={notice.id} delay={idx * 50}>
                <NoticeCard notice={notice} />
              </ScrollReveal>
            ))
          ) : (
            <div className={styles.emptyState}>등록된 소식이 없습니다.</div>
          )}
        </div>

        {hasNext && (
          <div className={styles.loadMoreWrapper}>
            <ScrollReveal>
              <Button 
                variant="secondary" 
                onClick={handleLoadMore}
                loading={loading}
              >
                소식 더보기
              </Button>
            </ScrollReveal>
          </div>
        )}
      </div>
    </section>
  );
};
export default NoticeSection;
