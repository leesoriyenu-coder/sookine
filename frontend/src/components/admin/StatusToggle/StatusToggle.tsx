"use client";

import React, { useState } from "react";
import styles from "./StatusToggle.module.css";
import { StoreStatus } from "@/types/store";
import { updateStoreStatus } from "@/lib/admin-api/store";
import { useToast } from "@/lib/hooks/useToast";
import { revalidatePaths } from "@/lib/admin-api/revalidate";
import { cn } from "@/lib/utils/cn";
import { RadioTower } from "lucide-react";

interface StatusToggleProps {
  currentStatus: StoreStatus;
  onStatusChange?: (newStatus: StoreStatus) => void;
}

export const StatusToggle = ({ currentStatus, onStatusChange }: StatusToggleProps) => {
  const [status, setStatus] = useState<StoreStatus>(currentStatus);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleStatusChange = async (newStatus: StoreStatus) => {
    if (newStatus === status || loading) return;
    
    const prevStatus = status;
    // 1. Optimistic UI Update (클라이언트에 먼저 반영)
    setStatus(newStatus);
    setLoading(true);

    try {
      // 2. API 호출
      const res = await updateStoreStatus(newStatus);
      if (res.success && res.data) {
        showToast(`영업 상태가 [${getStatusLabel(newStatus)}]으로 변경되었습니다.`, "success");
        if (onStatusChange) {
          onStatusChange(newStatus);
        }
        // 캐시 재검증 트리거
        await revalidatePaths(["/"]);
      } else {
        throw new Error(res.error?.message || "변경 실패");
      }
    } catch (e: any) {
      // 3. 에러 발생 시 원래 상태로 롤백
      setStatus(prevStatus);
      showToast(`상태 변경에 실패했습니다: ${e.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (s: StoreStatus) => {
    switch (s) {
      case "open": return "영업중";
      case "break": return "브레이크타임";
      case "closed": return "오늘 마감";
      case "holiday": return "휴무";
    }
  };

  const statusKeys: StoreStatus[] = ["open", "break", "closed", "holiday"];

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>
        <RadioTower size={18} />
        실시간 영업 상태 설정
      </h3>
      <div className={styles.buttonGrid}>
        {statusKeys.map((key) => {
          const isActive = status === key;
          const activeClass = isActive ? styles[`activeBtn_${key}`] : "";
          
          return (
            <button
              key={key}
              onClick={() => handleStatusChange(key)}
              disabled={loading}
              className={cn(styles.statusBtn, activeClass)}
            >
              <span className={styles.dot} />
              <span className={styles.statusLabel}>{getStatusLabel(key)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
export default StatusToggle;
