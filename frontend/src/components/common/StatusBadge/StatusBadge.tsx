import React from "react";
import styles from "./StatusBadge.module.css";
import { cn } from "@/lib/utils/cn";
import { StoreStatus } from "@/types/store";

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: StoreStatus;
  size?: "sm" | "md" | "lg";
}

const statusTextMap: Record<StoreStatus, string> = {
  open: "영업중",
  break: "브레이크타임",
  closed: "오늘 마감",
  holiday: "휴무",
};

export const StatusBadge = ({ className, status, size = "md", ...props }: StatusBadgeProps) => {
  return (
    <span
      className={cn(
        styles.statusBadge,
        styles[status],
        styles[size],
        className
      )}
      {...props}
    >
      <span 
        className={cn(
          styles.dot,
          status === "open" && "animate-pulse"
        )} 
      />
      <span>{statusTextMap[status]}</span>
    </span>
  );
};
