import React from "react";
import styles from "./Badge.module.css";
import { cn } from "@/lib/utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "signature" | "seasonal" | "urgent";
  children: React.ReactNode;
}

export const Badge = ({ className, variant = "signature", children, ...props }: BadgeProps) => {
  return (
    <span
      className={cn(
        styles.badge,
        styles[variant],
        className
      )}
      {...props}
    >
      {variant === "signature" && "🔥 "}
      {variant === "seasonal" && "🌿 "}
      {variant === "urgent" && "⚠️ "}
      {children}
    </span>
  );
};
