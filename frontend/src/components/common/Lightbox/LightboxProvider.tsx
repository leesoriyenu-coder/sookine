"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import styles from "./Lightbox.module.css";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface LightboxContextType {
  openLightbox: (imageUrl: string, alt: string) => void;
  closeLightbox: () => void;
}

export const LightboxContext = createContext<LightboxContextType | undefined>(undefined);

export const LightboxProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [altText, setAltText] = useState("");

  const openLightbox = (url: string, alt: string) => {
    setImageUrl(url);
    setAltText(alt);
    setIsOpen(true);
    document.body.style.overflow = "hidden"; // 스크롤 잠금
  };

  const closeLightbox = () => {
    setIsOpen(false);
    setImageUrl("");
    setAltText("");
    document.body.style.overflow = "unset"; // 스크롤 해제
  };

  // ESC 키 닫기 바인딩
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeLightbox();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <LightboxContext.Provider value={{ openLightbox, closeLightbox }}>
      {children}
      {isOpen && (
        <div 
          className={cn(styles.overlay, "animate-fade-in")} 
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
        >
          <div className={styles.content} onClick={(e) => e.stopPropagation()}>
            <button 
              className={styles.closeButton} 
              onClick={closeLightbox}
              aria-label="닫기"
            >
              <X size={24} />
            </button>
            <img 
              src={imageUrl} 
              alt={altText} 
              className={styles.image} 
            />
            {altText && <p className={styles.caption}>{altText}</p>}
          </div>
        </div>
      )}
    </LightboxContext.Provider>
  );
};
