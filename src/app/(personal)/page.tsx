"use client";

import { Doto, Fira_Code, Jersey_10 } from "next/font/google";
import MenuItem from "@/components/MenuItem";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MenuItemType, useMenu } from "@/providers/MenuContext";
import { useFolioHistory } from "@/providers/HistoryContext";
import ThreeScene from "@/components/ThreeScene";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import LinkedIn from "@/icons/LinkedIn";

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

const firaCode = Fira_Code({
  subsets: ["latin"],
  display: "swap",
  weight: "600",
});
export default function Home({ children }: any) {
  const { setActiveItem } = useMenu();
  const { updates, loading, error, refresh } = useFolioHistory();
  return (
    <ThreeScene>
      <div
        className={`w-full flex items-start flex-col gap-4 ${jersey10.className}`}
      >
        <SheetTrigger asChild className="pointer-events-auto">
          <div
            onClick={() => setActiveItem(MenuItemType.TERMINAL)}
            className="-mt-10 px-5 py-3 border-2 border-black hover:cursor-pointer  bg-slate-100/20 xl:bg-transparent"
          >
            <div>
              <CardTitle
                className={`${doto.className} text-black text-lg md:text-2xl`}
              >
                What I'm working on
              </CardTitle>
              <CardContent
                className={`${firaCode.className} pt-5 text-sm md:text-lg`}
              >
                <span className="text-[#6FA4AF] ">
                  {"lasan@lasan-desktop ~> "}
                </span>
                <span className="text-black mix-blend-darken">
                  {updates[0]?.text}
                </span>
                <span
                  className="
          ml-1 inline-block
          h-[1.1em] w-[1ch]
          bg-[#6FA4AF]
          align-baseline
          animate-cursor
        "
                />
              </CardContent>
            </div>
          </div>
        </SheetTrigger>
        <SheetTrigger asChild className="pointer-events-auto">
          <MenuItem onClick={() => setActiveItem(MenuItemType.PROJECTS)}>
            Projects
          </MenuItem>
        </SheetTrigger>
        <SheetTrigger asChild className="pointer-events-auto">
          <MenuItem onClick={() => setActiveItem(MenuItemType.ABOUT)}>
            About me
          </MenuItem>
        </SheetTrigger>
        <SheetTrigger asChild className="pointer-events-auto">
          <MenuItem onClick={() => setActiveItem(MenuItemType.CONTACT)}>
            Contact
          </MenuItem>
        </SheetTrigger>

        <div className="flex items-center gap-4">
          <Button
            size="icon"
            onClick={() =>
              window.open("https://github.com/kidfromjupiter/", "_blank")
            }
            className="bg-[#B8C4A9] hover:bg-[#B8C4A9] pointer-events-auto text-white border-1 hover:shadow-[1px_1px_0_2px_#ffffff]"
          >
            <Github className="w-10 h-10 fill-white" />
          </Button>
          <Button
            size="icon"
            className="bg-[#B8C4A9] hover:bg-[#B8C4A9] pointer-events-auto text-white border-1 hover:shadow-[1px_1px_0_2px_#ffffff]"
            onClick={() =>
              window.open(
                "https://www.linkedin.com/in/lasan-mahaliyana/",
                "_blank"
              )
            }
          >
            <LinkedIn className="w-6 h-6 fill-white" />
          </Button>
        </div>
      </div>
    </ThreeScene>
  );
}
