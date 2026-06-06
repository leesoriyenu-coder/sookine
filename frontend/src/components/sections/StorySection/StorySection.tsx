"use client";

import React from "react";
import styles from "./StorySection.module.css";
import { Timeline } from "./Timeline";
import { ScrollReveal } from "../../common/ScrollReveal/ScrollReveal";

export const StorySection = () => {
  return (
    <section id="story" className={styles.storySection}>
      <div className="container">
        <ScrollReveal>
          <div className={styles.sectionHeader}>
            <span className={styles.subTitle}>우리들의 역사</span>
            <h2 className={styles.title}>숙이네국수 이야기</h2>
          </div>
        </ScrollReveal>

        <Timeline />

        <div className={styles.quoteContainer}>
          <ScrollReveal delay={200}>
            <blockquote className={styles.blockquote}>
              "숙이네국수에 왜 국수가 없냐고요?<br />
              국수보다 단골들에게 대접하고 싶은 더 따뜻하고 맛있는 집밥이 생겼거든요."
              <cite className={styles.quoteAuthor}>— 사장님 한마디</cite>
            </blockquote>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};
