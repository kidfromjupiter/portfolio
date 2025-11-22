import "../globals.css";

import { Metadata } from "next";
import localFont from "next/font/local";
import { MenuProvider } from "@/providers/MenuContext";
import { FolioHistoryProvider } from "@/providers/HistoryContext";
import ThreeScene from "@/components/ThreeScene";
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
        <MenuProvider>
          <FolioHistoryProvider>{children}</FolioHistoryProvider>
        </MenuProvider>
      </body>
    </html>
  );
}
