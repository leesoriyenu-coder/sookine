"use client";

import React, { useState } from "react";
import styles from "./HeroSection.module.css";
import { AlertTriangle, X } from "lucide-react";
import { Notice } from "@/types/notice";

interface UrgentBannerProps {
  notice: Notice;
  onClose?: () => void;
}

export const UrgentBanner = ({ notice, onClose }: UrgentBannerProps) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  return (
    <div className={styles.urgentBanner} role="alert">
      <div className={styles.bannerContent}>
        <AlertTriangle size={16} className="animate-pulse" />
        <span>
          <strong>[긴급 공지]</strong> {notice.title} - {notice.content.substring(0, 100)}...
        </span>
      </div>
      <button 
        onClick={handleClose} 
        className={styles.closeBannerBtn}
        aria-label="공지 닫기"
      >
        <X size={16} />
      </button>
    </div>
  );
};
