import { Inter } from "next/font/google";
import { Metadata } from "next";
const inter = Inter({ subsets: ["latin"] });
export const metadata:Metadata = {
  title: "Dev blog",
  description: "Lasan's dev blog",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`dark:bg-neutral-900 bg-neutral-50 ${inter.className}`}>
      <div id='header' className="px-4 py-5 bg-slate-800">
        <div className="text-3xl bg-clip-text bg-gradient-to-br from-amber-400 to-amber-500 text-transparent font-bold ">
        Lasan&apos;s Dev Blog
        </div>
      </div>
      {children}
      <div className="bg-slate-900 py-5 text-center text-slate-600">Made in neovim. I use arch btw</div>
    </div>

  )
}
