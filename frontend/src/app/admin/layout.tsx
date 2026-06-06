"use client";

import React from "react";
import { AuthProvider } from "@/lib/context/AuthContext";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader/AdminHeader";
import styles from "./admin.module.css";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  return (
    <AuthProvider>
      {isLoginPage ? (
        // 로그인 페이지는 사이드바/헤더 없이 심플 폼만 렌더링
        <div style={{ width: "100%" }}>{children}</div>
      ) : (
        // 그 외 관리자 페이지들은 사이드바와 헤더가 들어가는 공통 레이아웃
        <div className={styles.adminLayout}>
          <AdminSidebar />
          <div className={styles.mainContent}>
            <AdminHeader />
            <main className={styles.contentArea}>
              {children}
            </main>
          </div>
        </div>
      )}
    </AuthProvider>
  );
}
