// ThreeBackground.tsx
"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import React, { Suspense, useEffect, useRef } from "react";
import { Sparks } from "./Sparks";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
// @ts-ignore
import * as THREE from "three";
import { NpmSpinnerLoader } from "./NPMLoadAnim";
import TopLevelObjectSuspenseBoundary from "./TopLevelObjectSuspenseBoundary";

const INNER_GRADIENT = "#D97D55";
const OUTER_GRADIENT = "#F4E9D7";

function CameraRig() {
  const { camera, pointer } = useThree();
  const base = useRef(new THREE.Vector3(0, 1.5, 15));
  const target = useRef(new THREE.Vector3());

  useFrame(() => {
    target.current.set(
      base.current.x + pointer.x * 40,
      base.current.y + pointer.y * 60,
      130
    );

    camera.position.lerp(target.current, 0.08);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

type Props = {
  onReady?: () => void;
};
export default function ThreeBackground({ onReady }: Props) {
  // If you want to wait until 3D assets are done, you can also use useProgress here.
  useEffect(() => {
    // called after first render; if you want to wait for full load, wire this to useProgress instead
    onReady?.();
  }, [onReady]);
  return (
    <>
      <Canvas
        className="relative pointer-events-auto"
        shadows
        camera={{ position: [0, 1.5, 110], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      >
        {/* Background “walls” */}
        <mesh position={[0, 0, -20]} scale={[50, 50, 1]}>
          <planeGeometry args={[12, 12]} />
          <meshBasicMaterial depthWrite={false} color={OUTER_GRADIENT} />
        </mesh>

        <mesh position={[0, 0, -40]}>
          <circleGeometry args={[70, 64]} />
          <meshBasicMaterial color={INNER_GRADIENT} depthWrite={false} />
        </mesh>

        {/* Lights */}
        <directionalLight
          position={[15, 6, 3]}
          intensity={0.5}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <ambientLight intensity={0.2} />
        {/* <pointLight position={[4, 6, 3]} intensity={1} /> */}
        <spotLight
          castShadow
          position={[4, 100, 3]}
          intensity={1500}
          angle={Math.PI / 3}
          penumbra={0.1}
          distance={2000}
          color={"#f0a686"}
        />

        <Sparks count={150} spread={500} speed={4} />
        <TopLevelObjectSuspenseBoundary />

        <EffectComposer>
          <Bloom
            intensity={1}
            luminanceThreshold={1}
            luminanceSmoothing={0.9}
            radius={0.1}
          />
        </EffectComposer>

        <CameraRig />
      </Canvas>

      <NpmSpinnerLoader />
    </>
  );
}
