"use client";

import React, { useState } from "react";
import styles from "./NoticeSection.module.css";
import { Notice } from "@/types/notice";
import { ChevronDown, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Card } from "../../common/Card/Card";

interface NoticeCardProps {
  notice: Notice;
}

export const NoticeCard = ({ notice }: NoticeCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
  };

  return (
    <Card 
      className={styles.noticeCard} 
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className={styles.cardHeader}>
        <h3 className={styles.noticeTitle}>
          {notice.is_urgent && (
            <span style={{ color: "var(--color-admin-error)", display: "inline-flex", alignItems: "center", marginRight: "4px" }}>
              <AlertCircle size={16} />
            </span>
          )}
          {notice.title}
        </h3>
        <span className={styles.noticeDate}>{formatDate(notice.created_at)}</span>
        <ChevronDown 
          size={18} 
          className={cn(
            styles.toggleIcon,
            isExpanded && styles.toggleIconExpanded
          )} 
        />
      </div>

      {isExpanded && (
        <div className={styles.cardBody}>
          <p className={styles.noticeContent}>{notice.content}</p>
        </div>
      )}
    </Card>
  );
};
