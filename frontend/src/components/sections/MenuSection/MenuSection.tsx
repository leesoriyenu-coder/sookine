"use client";

import React, { useEffect, useState } from "react";
import styles from "./MenuSection.module.css";
import { Menu, GroupedMenus } from "@/types/menu";
import { SideDish } from "@/types/side-dish";
import { ScrollReveal } from "../../common/ScrollReveal/ScrollReveal";
import { Card } from "../../common/Card/Card";
import { useLightbox } from "@/lib/hooks/useLightbox";

interface MenuSectionProps {
  groupedMenus: GroupedMenus;
  sideDishes: SideDish[];
}

export const MenuSection = ({ 
  groupedMenus: initialGrouped, 
  sideDishes: initialSides 
}: MenuSectionProps) => {
  const [groupedMenus, setGroupedMenus] = useState<GroupedMenus>(initialGrouped);
  const [sideDishes, setSideDishes] = useState<SideDish[]>(initialSides);
  const { openLightbox } = useLightbox();

  // 데모 상태 연동
  useEffect(() => {
    const syncData = () => {
      if (typeof window !== "undefined") {
        const localMenus = window.localStorage.getItem("sookine_menus");
        if (localMenus) {
          const allMenus: Menu[] = JSON.parse(localMenus);
          const visible = allMenus.filter((m) => m.is_visible);
          setGroupedMenus({
            signature: visible.filter((m) => m.is_signature),
            seasonal: visible.filter((m) => m.is_seasonal && !m.is_signature),
            regular: visible.filter((m) => !m.is_signature && !m.is_seasonal),
          });
        }
        const localSides = window.localStorage.getItem("sookine_side_dishes");
        if (localSides) {
          const allSides: SideDish[] = JSON.parse(localSides);
          setSideDishes(allSides.filter((s) => s.is_visible));
        }
      }
    };

    window.addEventListener("storage", syncData);
    window.addEventListener("focus", syncData);
    return () => {
      window.removeEventListener("storage", syncData);
      window.removeEventListener("focus", syncData);
    };
  }, []);

  const handleImageClick = (imageUrl: string | null, name: string) => {
    if (imageUrl) {
      openLightbox(imageUrl, name);
    }
  };

  return (
    <section id="menu" className={styles.menuSection}>
      <div className="container">
        <ScrollReveal>
          <div className={styles.sectionHeader}>
            <span className={styles.subTitle}>차림표</span>
            <h2 className={styles.title}>정성 가득한 한 상차림</h2>
          </div>
        </ScrollReveal>

        {/* 1. 대표 메뉴 섹션 */}
        {groupedMenus.signature.length > 0 && (
          <div className={styles.categoryGroup}>
            <ScrollReveal>
              <h3 className={styles.categoryTitle}>🔥 대표 메뉴</h3>
            </ScrollReveal>
            <div className={styles.signatureGrid}>
              {groupedMenus.signature.map((menu, idx) => (
                <ScrollReveal key={menu.id} delay={idx * 100}>
                  <Card.MenuSignature
                    name={menu.name}
                    price={menu.price}
                    description={menu.description}
                    imageUrl={menu.image_url}
                    note={menu.note}
                    isSeasonal={menu.is_seasonal}
                    onImageClick={() => handleImageClick(menu.image_url, menu.name)}
                  />
                </ScrollReveal>
              ))}
            </div>
          </div>
        )}

        {/* 2. 시즌 메뉴 섹션 */}
        {groupedMenus.seasonal.length > 0 && (
          <div className={styles.categoryGroup}>
            <ScrollReveal>
              <h3 className={styles.categoryTitle}>🌿 시즌 한정 메뉴</h3>
            </ScrollReveal>
            <div className={styles.regularGrid}>
              {groupedMenus.seasonal.map((menu, idx) => (
                <ScrollReveal key={menu.id} delay={idx * 100}>
                  <Card.Menu
                    name={menu.name}
                    price={menu.price}
                    description={menu.description}
                    imageUrl={menu.image_url}
                    note={menu.note}
                    isSeasonal={true}
                    onImageClick={() => handleImageClick(menu.image_url, menu.name)}
                  />
                </ScrollReveal>
              ))}
            </div>
          </div>
        )}

        {/* 3. 상시 메뉴 섹션 */}
        {groupedMenus.regular.length > 0 && (
          <div className={styles.categoryGroup}>
            <ScrollReveal>
              <h3 className={styles.categoryTitle}>📋 식사 메뉴</h3>
            </ScrollReveal>
            <div className={styles.regularGrid}>
              {groupedMenus.regular.map((menu, idx) => (
                <ScrollReveal key={menu.id} delay={idx * 100}>
                  <Card.Menu
                    name={menu.name}
                    price={menu.price}
                    description={menu.description}
                    imageUrl={menu.image_url}
                    note={menu.note}
                    onImageClick={() => handleImageClick(menu.image_url, menu.name)}
                  />
                </ScrollReveal>
              ))}
            </div>
          </div>
        )}

        {/* 4. 기본찬 소개 섹션 */}
        {sideDishes.length > 0 && (
          <div className={styles.categoryGroup}>
            <ScrollReveal>
              <h3 className={styles.categoryTitle}>🥢 오늘을 담은 기본찬</h3>
              <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", marginBottom: "var(--space-4)" }}>
                계절에 따라 매일 바뀌는 반찬 — 새벽 시장에서 재료를 직접 공수하여 당일 조리합니다. (클릭 시 확대)
              </p>
            </ScrollReveal>
            
            <div className={styles.sideDishGalleryContainer}>
              <div className={styles.galleryScrollArea}>
                {sideDishes.map((dish, idx) => (
                  <div key={dish.id} className={styles.galleryItem}>
                    <ScrollReveal delay={idx * 50}>
                      <Card.SideDish
                        name={dish.name}
                        imageUrl={dish.image_url}
                        onImageClick={() => handleImageClick(dish.image_url, dish.name)}
                      />
                    </ScrollReveal>
                  </div>
                ))}
              </div>
            </div>
            <ScrollReveal>
              <div className={styles.refillBadge}>
                공기밥은 무료 리필입니다 🍚
              </div>
            </ScrollReveal>
          </div>
        )}
      </div>
    </section>
  );
};
