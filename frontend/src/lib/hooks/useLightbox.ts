"use client";

import { useContext } from "react";
import { LightboxContext } from "@/components/common/Lightbox/LightboxProvider";

export function useLightbox() {
  const context = useContext(LightboxContext);
  if (!context) {
    throw new Error("useLightbox must be used within a LightboxProvider");
  }
  return context;
}
