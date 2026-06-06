"use client";

import React, { createContext, useState, useCallback } from "react";
import styles from "./Toast.module.css";
import { X, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type ToastType = "success" | "error";

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // 3초 후 자동 제거
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className={styles.toastContainer}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(styles.toast, styles[toast.type])}
            role="alert"
          >
            {toast.type === "success" ? (
              <CheckCircle size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
            <span className={styles.message}>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className={styles.closeBtn}
              aria-label="닫기"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider> // 주의: 오탈자 방지: 아래 Context Provider 매핑 확인.
  );
};
