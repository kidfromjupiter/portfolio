"use client";

import { useFrame } from "@react-three/fiber";
import React, { useRef, useState } from "react";
// @ts-ignore
import * as THREE from "three";
import { StlModel } from "./StlModel";

type ClickableObjectProps = {
  onClick?: () => void;
  meshUrl: string;
  meshScale?: number;
  position?: [number, number, number];
};

export function ClickableObject({
  onClick,
  meshUrl,
  meshScale = 0.5,
  position = [0, 0, 0],
}: ClickableObjectProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // idle spin just for vibe
  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.1;
    meshRef.current.rotation.z = Math.sin(Date.now() * 0.001) * 0.05;
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      // pointer events
      onClick={(e) => {
        e.stopPropagation(); // so clicks don't bubble to background
        onClick?.();
        console.log("ClickableObject clicked");
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        document.body.style.cursor = "default";
      }}
    >
      <StlModel
        url={meshUrl}
        scale={meshScale}
        color={hovered ? "#ffe58a" : "#9ce9f8"} // highlight on hover
      />
    </mesh>
  );
}
