"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Center, Html, PresentationControls, Text } from "@react-three/drei";
import React, { Suspense, useRef } from "react";
import { Sparks } from "./Sparks";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

// @ts-ignore
import * as THREE from "three";
import { StlModel } from "./StlModel";

import { Doto } from "next/font/google";
import { Jersey_10 } from "next/font/google";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { ClickableObject } from "./ClickableObject";
import { BottomLeftButtons } from "./CornerButtons";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MenuItemType, useMenu } from "@/providers/MenuContext";
import { HistoryEntry, TerminalHistory } from "./TerminalHistory";
import { GitProfileCommitsPopup } from "./CommitOverlay";
import { useFolioHistory } from "@/providers/HistoryContext";
import { ProjectsScroller } from "./ProjectView";

const doto = Doto({
  subsets: ["latin"],
  display: "swap",
  weight: "900",
});

const jersey10 = Jersey_10({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

const INNER_GRADIENT = "#D97D55";
const OUTER_GRADIENT = "#F4E9D7";
const ACCENT_COLOR = "#9ce9f8";

function CameraRig() {
  const { camera, pointer } = useThree();
  const base = useRef(new THREE.Vector3(0, 1.5, 15)); // base camera position
  const target = useRef(new THREE.Vector3());

  useFrame(() => {
    // pointer.x / pointer.y are in [-1, 1]
    target.current.set(
      base.current.x + pointer.x * 40, // horizontal parallax
      base.current.y + pointer.y * 60, // vertical parallax
      130 // keep distance constant
    );

    camera.position.lerp(target.current, 0.08);
    camera.lookAt(0, 0, 0); // look at the object at the origin
  });

  return null;
}

function SpinningObjects() {
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

export default function ThreeScene({
  children,
}: {
  children: React.ReactNode;
}) {
  const { activeItem } = useMenu();
  const { updates, loading, error, refresh } = useFolioHistory();
  return (
    <Sheet>
      <section className="w-full h-screen">
        {/* 3D background */}
        <Canvas
          className="relative pointer-events-auto" // 👈 make Canvas fill and sit behind
          shadows
          camera={{ position: [0, 1.5, 110], fov: 50 }}
          dpr={[1, 2]}
          gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
        >
          <Text
            position={[20, -55, 0]}
            fontSize={2}
            color="#2a2420"
            anchorX="center"
            anchorY="middle"
            font="/fonts/Doto-VariableFont_ROND,wght.ttf"
          >
            built with three.js
          </Text>
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
            position={[4, 6, 3]}
            intensity={0.5}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <ambientLight intensity={0.2} />
          <pointLight position={[4, 6, 3]} intensity={1} />
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

          <BottomLeftButtons>
            <ClickableObject
              meshUrl="/models/octocat.STL"
              meshScale={0.13}
              position={[0, 0, 0]}
              onClick={() => window.open("https://github.com/kidfromjupiter/")}
            />
            <ClickableObject
              meshUrl="/models/li_coaster.stl"
              meshScale={0.08}
              position={[10, 0, 0]}
              onClick={() =>
                window.open("https://www.linkedin.com/in/lasan-mahaliyana/")
              }
            />
          </BottomLeftButtons>

          <Suspense fallback={null}>
            <SpinningObjects />
          </Suspense>
          <EffectComposer>
            <Bloom
              intensity={1} // overall glow strength
              luminanceThreshold={1} // how bright something must be to glow
              luminanceSmoothing={0.9}
              radius={0.1} // spread of the glow
            />
          </EffectComposer>
          <CameraRig />
        </Canvas>
        <GitProfileCommitsPopup />
        {/* HTML content layer on top */}
        <div className="absolute z-10 flex h-full px-8 md:px-16 left-0 top-0 w-full pointer-events-none">
          <div className=" space-y-4 pt-10 text-neutral-900 w-full">
            <p
              className={`lg:text-7xl md:text-5xl xs:text-4xl text-3xl w-full text-right uppercase 
                tracking-[0.3em] text-weight-900
                 ${jersey10.className} text-[#6FA4AF] `}
              style={{ textShadow: "2px 2px #000000" }}
            >
              Lasan
              <br />
              Mahaliyana
            </p>
            <div className="w-full flex justify-end ">
              <Card className="bg-[#B8C4A9]">
                <CardHeader>
                  <CardDescription className={`${doto.className} text-black`}>
                    Standing on the shoulders of giants.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
            <div className="md:max-w-[500px] pt-16">{children}</div>
          </div>
        </div>
        <SheetContent
          side={"left"}
          className="w-[90%] md:max-w-[50vw] flex flex-col bg-[#B8C4A9] m-2 h-screen max-h-screen shadow-[10px_10px_0_2px_#ffffff] border-2 border-black"
        >
          <div className="absolute h-2 w-2 -top-2 -left-2 bg-black"></div>
          <SheetHeader>
            <SheetTitle
              style={{ textShadow: "2px 2px #000000" }}
              className={`${jersey10.className} text-4xl text-[#6FA4AF] `}
            >
              {activeItem}
            </SheetTitle>
            <SheetDescription className={`${doto.className} text-black`}>
              Cool things i've done over the years
            </SheetDescription>
          </SheetHeader>
          {activeItem === MenuItemType.TERMINAL && (
            <TerminalHistory entries={updates} />
          )}
          {activeItem === MenuItemType.ABOUT && (
            <div
              className={`${jersey10.className} text-black text-2xl overflow-y-auto p-4`}
            >
              <span className="mt-3 block">
                I've been programming since I was 12 years old. I stumbled upon
                the world of programming while struggling to install a game on
                my dad's laptop. Not knowing heads or tails about the errors it
                was giving me, I inevitably turned to google. Which forced me
                down a rabbit hole of code.
              </span>
              <br />
              <span className="mt-3 block">
                Fast forward 8 years and here I am. My main focus these days is
                improving on my craft and learning new things. Work revolves
                around django, react and new web technologies that popup here
                and there.
              </span>
              <br />
              <span className="mt-3 block">
                Wanna know what I've been upto? Check out my projects. Whenever
                I'm not working, I'm probably off tweaking my setups or spending
                copious amounts of money buying arduinos and reverse engineering
                drivers for linux.
              </span>
            </div>
          )}
          {activeItem === MenuItemType.PROJECTS && <ProjectsScroller />}
          <SheetFooter className="mt-auto flex justify-end">
            <SheetClose asChild>
              <Button className="bg-[#D97D55] hover:bg-[#bb6e4a] text-white border-2">
                Close
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </section>
    </Sheet>
  );
}
