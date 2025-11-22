"use client";

import React, { Suspense, useState } from "react";

import dynamic from "next/dynamic";

// @ts-ignore
import { Doto } from "next/font/google";
import { Jersey_10 } from "next/font/google";
import { Card, CardDescription, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
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
import { ContactMeCard } from "./ContactMe";
import { NpmSpinnerLoaderRegular } from "./NpmLoaderRegular";
import Github from "@/icons/Github";
import LinkedIn from "@/icons/LinkedIn";
const ThreeBackground = dynamic(() => import("./ThreeBackground"), {
  ssr: false,
  loading: () => null, // IMPORTANT: no extra wrapper UI to avoid WebGL weirdness
});
//
// const ThreeBackground = React.lazy(() => import("./ThreeBackground"));
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

export default function ThreeScene({
  children,
}: {
  children: React.ReactNode;
}) {
  const { activeItem } = useMenu();
  const { updates, loading, error, refresh } = useFolioHistory();
  const [bgReady, setBgReady] = useState(false);
  return (
    <Sheet>
      <section className="w-full h-screen">
        {/* 3D background */}
        <ThreeBackground onReady={() => setBgReady(true)} />
        {!bgReady && <NpmSpinnerLoaderRegular />}
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
              {activeItem === MenuItemType.CONTACT &&
                "Say hi, ask about a project, or reach out for collaboration."}
              {activeItem === MenuItemType.ABOUT && "fun facts"}
              {activeItem === MenuItemType.PROJECTS &&
                "Cool things i've done over the years"}
              {activeItem === MenuItemType.TERMINAL && "What I've been upto"}
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
          {activeItem === MenuItemType.CONTACT && <ContactMeCard />}
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
