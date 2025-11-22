"use client";
import { useEffect, useState } from "react";

// npm-style spinner frames (same as cli-spinners "dots")
const FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

export function NpmSpinnerLoaderRegular() {
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setFrameIndex((i) => (i + 1) % FRAMES.length);
      console.log("NpmSpinnerLoaderRegular frameIndex:", frameIndex);
    }, 80); // speed of spinner

    return () => clearInterval(id);
  }, []);

  console.log("NpmSpinnerLoaderRegular render, frameIndex:", frameIndex);

  return (
    <div className="pointer-events-none fixed inset-0 z-5 flex md:items-center justify-center items-start py-2">
      <div className="pointer-events-auto flex flex-col items-center border border-neutral-800 bg-neutral-950/90 px-6 py-4 shadow-[3px_3px_0_0_#ffffff]">
        <div className="flex items-center gap-3">
          <span className="text-2xl text-emerald-400 font-mono">
            {FRAMES[frameIndex]}
          </span>
          <span className="font-mono text-emerald-400">Loading</span>
        </div>
      </div>
    </div>
  );
}
