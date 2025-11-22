"use client";

import { useProgress } from "@react-three/drei";
import { useEffect, useState } from "react";

// npm-style spinner frames (same as cli-spinners "dots")
const FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

export function NpmSpinnerLoader() {
  const { active, progress, item } = useProgress();
  const [frameIndex, setFrameIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  // Show as soon as loading starts
  useEffect(() => {
    if (active) setVisible(true);
  }, [active]);

  // Animate the spinner while loading
  useEffect(() => {
    if (!active) return;

    const id = setInterval(() => {
      setFrameIndex((i) => (i + 1) % FRAMES.length);
    }, 80); // speed of spinner

    return () => clearInterval(id);
  }, [active]);

  // Fade out after loading completes
  useEffect(() => {
    if (!active && progress === 100) {
      const timeout = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [active, progress]);

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-5 flex md:items-center justify-center items-start py-2">
      <div className="pointer-events-auto flex flex-col items-center border border-neutral-800 bg-neutral-950/90 px-6 py-4 shadow-[3px_3px_0_0_#ffffff]">
        <div className="flex items-center gap-3">
          <span className="text-2xl text-emerald-400 font-mono">
            {FRAMES[frameIndex]}
          </span>
        </div>
      </div>
    </div>
  );
}
