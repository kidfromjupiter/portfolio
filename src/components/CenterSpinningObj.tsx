import { Center, Html, PresentationControls, Text } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { StlModel } from "./StlModel";
import { useRef } from "react";
// @ts-ignore
import * as THREE from "three";

const ACCENT_COLOR = "#9ce9f8";
export default function SpinningObjects() {
  const groupRef = useRef<THREE.Group>(null);
  const isDragging = useRef(false);
  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Only spin when not interacting
    if (!isDragging.current) {
      groupRef.current.rotation.y += delta * 0.3; // tweak speed here
    }
  });

  //   useFrame((_, delta) => {
  //     if (!groupRef.current) return;
  //     groupRef.current.rotation.y += delta * 0.3;
  //   });

  return (
    <PresentationControls
      global={false} // rotate local group, not whole scene
      cursor // show grabbing cursor
      speed={1.2}
      zoom={0.75} // disable scroll zoom effect from controls
      rotation={[0, 0, 0]} // initial rotation
      //damping={0.3}
      //polar={[-Math.PI / 2, Math.PI / 2]} // vertical rotation limits
      //azimuth={[-Math.PI / 3, Math.PI / 3]} // horizontal rotation limits
      //config={{ mass: 1, tension: 170, friction: 26 }} // springiness
    >
      <group
        ref={groupRef}
        onPointerDown={() => {
          isDragging.current = true;
        }}
        onPointerUp={() => {
          isDragging.current = false;
        }}
        onPointerOut={() => {
          isDragging.current = false;
        }}
      >
        {/* Center sphere */}
        <Center>
          <mesh position={[0, 0, 100]} rotation={[90, 90, 90]} receiveShadow>
            <StlModel
              url="/models/BoxBody.stl"
              color={ACCENT_COLOR}
              scale={0.5}
            />
          </mesh>
          <mesh position={[10, 10, 130]} rotation={[90, 100, 90]} receiveShadow>
            <StlModel
              url="/models/BoxCap.stl"
              color={ACCENT_COLOR}
              scale={0.5}
            />
          </mesh>
        </Center>
      </group>
    </PresentationControls>
  );
}
