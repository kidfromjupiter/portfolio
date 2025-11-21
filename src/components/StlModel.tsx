// src/components/StlModel.tsx
"use client";

import { useLoader } from "@react-three/fiber";
import { Center } from "@react-three/drei";

// @ts-ignore
import * as THREE from "three";
// @ts-ignore
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";

type StlModelProps = {
  url: string; // e.g. "/models/robot.stl"
  color?: string;
  scale?: number; // STL files are often huge, we’ll scale them down
};

export function StlModel({
  url,
  color = "#ffffff",
  scale = 0.01,
}: StlModelProps) {
  const geometry = useLoader(STLLoader, url) as THREE.BufferGeometry;

  // Make sure lighting looks nice
  geometry.computeVertexNormals();

  return (
    <Center>
      {" "}
      {/* recenters the mesh so it's around (0,0,0) */}
      <mesh geometry={geometry} scale={scale} castShadow receiveShadow>
        <meshStandardMaterial color={color} metalness={0.2} roughness={0.2} />
      </mesh>
    </Center>
  );
}
