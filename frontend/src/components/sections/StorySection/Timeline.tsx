"use client";

import React from "react";
import styles from "./StorySection.module.css";
import { ScrollReveal } from "../../common/ScrollReveal/ScrollReveal";

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  imageUrl?: string;
  fallbackIcon: string;
}

const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    year: "1990년대 ~ 2000년대",
    title: "달콤한 향이 가득했던 빵집 시절",
    description: "원래 이 자리에서 동네 빵집을 오랫동안 운영했어요. 매일 아침 오븐에서 빵을 굽고 손님들과 따뜻한 정을 나누던 정겨운 공간이었습니다.",
    fallbackIcon: "🍞",
  },
  {
    year: "2010년대 초",
    title: "프랜차이즈 시대와 폐업의 위기",
    description: "대형 프랜차이즈 빵집들이 동네 골목까지 들어오면서 상권 변화를 겪고 문을 닫아야 하는 아픈 위기가 찾아왔습니다.",
    fallbackIcon: "🏚️",
  },
  {
    year: "2015년",
    title: "남편의 권유, 그리고 '숙이네국수'의 시작",
    description: "남편이 제 손맛을 믿어주며 '당신은 음식을 참 잘하니 국수집이라도 소소하게 시작해보자'며 용기를 주었습니다. 그렇게 간판을 달고 새 출발을 했습니다.",
    fallbackIcon: "🍜",
  },
  {
    year: "2018년 ~ 2022년",
    title: "단골들의 요청으로 넓혀진 밥상",
    description: "국수를 먹으러 오던 주변 직장인 단골분들께서 '든든하게 밥 한 끼 먹을 백반 메뉴도 해달라'고 조르기 시작하셨어요. 그렇게 단골들 등쌀에 갈치조림과 두루치기 정식이 추가되었습니다.",
    fallbackIcon: "🍲",
  },
  {
    year: "현재",
    title: "국수 없는 국수집, 마음을 담은 집밥 한 상",
    description: "이제는 빵도 국수도 팔지 않지만, 손글씨 간판 아래에서 매일 신선한 갈치와 돼지고기를 볶고 매일 새벽 시장에서 공수해 온 나물로 엄마의 따뜻한 밥상을 지켜갑니다.",
    fallbackIcon: "🏠",
  },
];

export const Timeline = () => {
  return (
    <div className={styles.timeline}>
      {TIMELINE_EVENTS.map((event, index) => (
        <div key={index} className={styles.timelineItem}>
          <div className={styles.timelineNode} />
          <ScrollReveal delay={index * 150}>
            <div className={styles.timelineContent}>
              <div className={styles.timelineInner}>
                <div className={styles.timelineText}>
                  <div className={styles.timelineYear}>{event.year}</div>
                  <h4 className={styles.timelineTitle}>{event.title}</h4>
                  <p className={styles.timelineDesc}>{event.description}</p>
                </div>
                <div className={styles.timelineThumbnail}>
                  {event.imageUrl ? (
                    <img src={event.imageUrl} alt={event.title} className={styles.timelineImg} />
                  ) : (
                    <span className={styles.timelineEmoji}>{event.fallbackIcon}</span>
                  )}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      ))}
    </div>
  );
};
