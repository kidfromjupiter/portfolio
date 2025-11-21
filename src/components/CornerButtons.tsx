"use client";

import { useThree } from "@react-three/fiber";
import React from "react";
import { ClickableObject } from "./ClickableObject";

export function BottomLeftButtons({ children }: { children: React.ReactNode }) {
  const { width, height } = useThree((state) => state.viewport);

  // 🔹 tweak these manually to taste
  const smallMarginX = 1.5;
  const smallMarginY = 1.5;

  const largeMarginX = 8; // more towards center on big screens
  const largeMarginY = 3;

  // 🔹 world-space width breakpoint where you consider it “large”
  // with your camera far away this will probably always be > 30,
  // so feel free to bump this up if needed
  const LARGE_VIEWPORT_THRESHOLD = 40;

  const isLarge = width > LARGE_VIEWPORT_THRESHOLD;

  const marginX = isLarge ? largeMarginX : smallMarginX;
  const marginY = isLarge ? largeMarginY : smallMarginY;

  const baseX = -width / 2 + marginX;
  const baseY = -height / 2 + marginY;
  return <group position={[baseX, baseY, 0]}>{children}</group>;
}
