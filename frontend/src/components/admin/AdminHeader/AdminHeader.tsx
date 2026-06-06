"use client";

import React from "react";
import styles from "./AdminHeader.module.css";
import { LogOut, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "../../common/Button/Button";

export const AdminHeader = () => {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    if (confirm("로그아웃 하시겠습니까?")) {
      await logout();
      router.push("/admin/login");
    }
  };

  return (
    <header className={styles.header}>
      <h2 className={styles.title}>숙이네국수 관리 대시보드</h2>

      <div className={styles.rightArea}>
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={() => window.open("/", "_blank")}
          style={{ height: "36px" }}
        >
          <Home size={14} style={{ marginRight: "6px" }} />
          내 가게 바로가기
        </Button>

        <button 
          onClick={handleLogout} 
          className={styles.logoutBtn}
          title="로그아웃"
          aria-label="로그아웃"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};
export default AdminHeader;
