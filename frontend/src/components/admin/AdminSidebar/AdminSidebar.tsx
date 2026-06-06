"use client";

import React from "react";
import styles from "./AdminSidebar.module.css";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { cn } from "@/lib/utils/cn";
import {
  LayoutDashboard,
  UtensilsCrossed,
  Megaphone,
  ChefHat,
  Store,
  LogOut,
} from "lucide-react";

export const AdminSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const menuItems = [
    { name: "대시보드", href: "/admin", icon: LayoutDashboard },
    { name: "메뉴 관리", href: "/admin/menus", icon: UtensilsCrossed },
    { name: "공지 관리", href: "/admin/notices", icon: Megaphone },
    { name: "기본찬 관리", href: "/admin/side-dishes", icon: ChefHat },
    { name: "매장 정보", href: "/admin/store-info", icon: Store },
  ];

  const handleLogout = async () => {
    if (confirm("로그아웃 하시겠습니까?")) {
      await logout();
      router.push("/admin/login");
    }
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoArea}>
        <span className={styles.logoText}>숙이네국수 관리자</span>
      </div>

      <nav className={styles.menuList}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                styles.linkItem,
                isActive && styles.activeLink
              )}
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className={styles.footerArea}>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          <LogOut size={18} />
          <span>로그아웃</span>
        </button>
      </div>
    </aside>
  );
};
export default AdminSidebar;
