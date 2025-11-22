// src/components/GlbModel.tsx
"use client";

import { useLoader } from "@react-three/fiber";
import { Center } from "@react-three/drei";
import React, { useMemo } from "react";

// @ts-ignore
import * as THREE from "three";
// @ts-ignore
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

type GlbModelProps = {
  url: string; // e.g. "/models/robot.glb"
  color?: string; // optional override for all mesh materials
  scale?: number;
};

export function GlbModel({ url, color, scale = 1 }: GlbModelProps) {
  const gltf = useLoader(GLTFLoader, url);

  // Clone and tweak the scene so we don't mutate the original
  const scene = useMemo(() => {
    const root = gltf.scene.clone(true);

    root.traverse((child: any) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        // Optionally override material color
        if (color) {
          mesh.material = new THREE.MeshStandardMaterial({
            color,
            metalness: 0.2,
            roughness: 0.2,
          });
        }
      }
    });

    return root;
  }, [gltf.scene, color]);

  return (
    <Center>
      <primitive object={scene} scale={scale} />
    </Center>
  );
}
