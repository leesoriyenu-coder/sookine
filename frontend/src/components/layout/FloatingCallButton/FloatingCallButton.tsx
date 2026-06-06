"use client";

import React, { useEffect, useState } from "react";
import styles from "./FloatingCallButton.module.css";
import { Phone } from "lucide-react";

interface FloatingCallButtonProps {
  initialPhone: string;
}

export const FloatingCallButton = ({ initialPhone }: FloatingCallButtonProps) => {
  const [phone, setPhone] = useState(initialPhone);

  useEffect(() => {
    const syncPhone = () => {
      if (typeof window !== "undefined") {
        const localStore = window.localStorage.getItem("sookine_store_info");
        if (localStore) {
          const info = JSON.parse(localStore);
          setPhone(info.phone || initialPhone);
        }
      }
    };

    window.addEventListener("storage", syncPhone);
    window.addEventListener("focus", syncPhone);
    return () => {
      window.removeEventListener("storage", syncPhone);
      window.removeEventListener("focus", syncPhone);
    };
  }, [initialPhone]);

  const rawPhone = phone.replace(/[^0-9]/g, "");

  return (
    <a
      href={`tel:${rawPhone}`}
      className={styles.floatingButton}
      aria-label="전화 걸기"
      title="매장 바로 전화하기"
    >
      <Phone size={24} />
    </a>
  );
};
export default FloatingCallButton;
