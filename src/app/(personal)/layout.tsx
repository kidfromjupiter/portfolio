import "../globals.css";
import { Providers } from "./providers";

import { Image, Tabs, Tab } from "@nextui-org/react";
import NextImage from "next/image";
import Github from "@/icons/Github";
import LinkedIn from "@/icons/LinkedIn";
import Instagram from "@/icons/Instagram";
import NavBar from "@/components/Navbar";
import { Metadata } from "next";
import localFont from "next/font/local";
import ThreeScene from "@/components/ThreeScene";
import { MenuProvider } from "@/providers/MenuContext";
import { FolioHistoryProvider } from "@/providers/HistoryContext";
const inter = localFont({
  src: "../../fonts/Inter/inter.ttf",
  display: "swap",
});
export const metadata: Metadata = {
  title: "Lasan Mahaliyana",
  description: "Lasan Mahaliyana's personal portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="dark"
      style={
        {
          // fontSize: "16px",
        }
      }
    >
      <body className={inter.className + " " + " bg-slate-900 "}>
        <Providers>
          <MenuProvider>
            <FolioHistoryProvider>
              <ThreeScene>{children}</ThreeScene>
            </FolioHistoryProvider>
          </MenuProvider>
        </Providers>
      </body>
    </html>
  );
}
