"use client";

import React, { useEffect, useRef, useState } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number; // ms 단위
  duration?: number; // ms 단위
  threshold?: number;
}

export const ScrollReveal = ({ 
  children, 
  delay = 0, 
  threshold = 0.2 
}: ScrollRevealProps) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          // 한 번 보이면 관찰을 중단하여 한 번만 작동하게 함
          if (elementRef.current) {
            observer.unobserve(elementRef.current);
          }
        }
      },
      {
        threshold,
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.disconnect();
      }
    };
  }, [threshold]);

  const delayStyle = delay ? { animationDelay: `${delay}ms` } : {};

  return (
    <div
      ref={elementRef}
      className={isRevealed ? "animate-fade-in-up" : ""}
      style={{
        opacity: isRevealed ? undefined : 0,
        animationFillMode: "both",
        ...delayStyle,
      }}
    >
      {children}
    </div>
  );
};
