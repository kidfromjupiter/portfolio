"use client";

import { useFrame } from "@react-three/fiber";
import React, { useMemo, useRef } from "react";
// @ts-ignore
import * as THREE from "three";

type SparksProps = {
  count?: number;
  spread?: number; // how far from center to spawn
  speed?: number; // base speed
};

export function Sparks({ count = 150, spread = 20, speed = 2 }: SparksProps) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // random position near center (sphere-ish)
      const r = spread * Math.random() * 0.4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      arr[i3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      arr[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count, spread]);

  // random directions / velocities
  const velocities = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const dir = new THREE.Vector3(
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1
      ).normalize();
      const s = speed * (0.1 + Math.random() * 0.4); // smallish
      arr[i3 + 0] = dir.x * s;
      arr[i3 + 1] = dir.y * s;
      arr[i3 + 2] = dir.z * s;
    }
    return arr;
  }, [count, speed]);

  const geoRef = useRef<THREE.BufferGeometry>(null);

  useFrame((_, delta) => {
    const g = geoRef.current;
    if (!g) return;
    const pos = g.attributes.position as THREE.BufferAttribute;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // update position
      pos.array[i3 + 0] += velocities[i3 + 0] * delta;
      pos.array[i3 + 1] += velocities[i3 + 1] * delta;
      pos.array[i3 + 2] += velocities[i3 + 2] * delta;

      // distance from center
      const x = pos.array[i3 + 0];
      const y = pos.array[i3 + 1];
      const z = pos.array[i3 + 2];
      const dist = Math.sqrt(x * x + y * y + z * z);

      // if it goes too far, respawn near center
      if (dist > spread) {
        const r = spread * Math.random() * 0.2;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;

        pos.array[i3 + 0] = r * Math.sin(phi) * Math.cos(theta);
        pos.array[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        pos.array[i3 + 2] = r * Math.cos(phi);
      }
    }

    pos.needsUpdate = true;
  });

  return (
    <points>
      <bufferGeometry ref={geoRef}>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.8} // dot size
        sizeAttenuation
        color={[4, 3.2, 2]}
        //color="#B8C4A9" // soft warm spark color
        transparent
        //color="hsla(87, 19%, 72%, 1.00)" // soft warm spark color
        opacity={0.9}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  );
}
