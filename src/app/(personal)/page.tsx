"use client";

import { Doto, Fira_Code, Jersey_10 } from "next/font/google";
import MenuItem from "@/components/MenuItem";
import { useRouter } from "next/navigation";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MenuItemType, useMenu } from "@/providers/MenuContext";
import { useFolioHistory } from "@/providers/HistoryContext";

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
  const router = useRouter();
  const { setActiveItem } = useMenu();
  const { updates, loading, error, refresh } = useFolioHistory();
  return (
    <div
      className={`w-full flex items-start flex-col gap-4 ${jersey10.className}`}
    >
      <SheetTrigger asChild className="pointer-events-auto">
        <div
          onClick={() => setActiveItem(MenuItemType.TERMINAL)}
          className="-mt-10 px-5 py-3 border-2 border-black hover:cursor-pointer  backdrop-blur-md md:backdrop-blur-none"
        >
          <div>
            <CardTitle
              className={`${doto.className} text-black text-xl md:text-2xl`}
            >
              What I'm working on
            </CardTitle>
            <CardContent className={`${firaCode.className} pt-5`}>
              <span className="text-[#6FA4AF]">
                {"lasan@lasan-desktop ~> "}
              </span>
              <span>{updates[0]?.text}</span>
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
    </div>
  );
}
