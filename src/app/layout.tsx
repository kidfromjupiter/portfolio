import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Card from "@/components/card";
import CardHolder from "@/components/cardholder";
import {
	useMotionValue,
	LayoutGroup,
	motion,
	useTransform,
} from "framer-motion";
import { useState } from "react";
import { Image, Tabs, Tab } from "@nextui-org/react";
import NextImage from "next/image";
import Github from "@/icons/Github";
import LinkedIn from "@/icons/LinkedIn";
import Instagram from "@/icons/Instagram";
import { usePathname } from "next/navigation";
import NavBar from "@/components/Navbar";
import Link from "next/link";
const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
// 	title: "Create Next App",
// 	description: "Generated by create next app",
// };
// app/layout.tsx

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
			<body className={inter.className + " " + " bg-slate-900"}>
				<Providers>
					<div
						className="px-10 py-5 lg:py-0  grid grid-rows-[20%_80%] lg:grid-cols-2 min-h-screen  items-center justify-between  bg-cover bg-center bg-no-repeat relative bg-slate-900"
						style={{
							backgroundImage: "url(/texture.jpg)",
							backgroundBlendMode: "color-burn",
						}}
					>
						<div
							id="infoholder"
							className="flex lg:min-h-screen flex-row lg:flex-col justify-evenly "
						>
							<div id="general_about">
								<div className="py-5">
									<div id="name">
										<span className="  text-5xl bg-clip-text text-transparent bg-gradient-to-r  from-amber-400 to-amber-500 font-extrabold">
											Lasan Mahaliyana
										</span>
									</div>
									<div id="title" className="text-3xl text-slate-300">
										Full stack developer
									</div>
								</div>
								<div id="about_small" className="text-2xl text-slate-500">
									I build performant web applications for clients and help
									create scalable, robust platforms
								</div>
							</div>
							<div id="photo_and_contact" className="px-5">
								<Image
									as={NextImage}
									width={250}
									height={380}
									src="/me.jpg"
									alt="NextUI hero Image"
									isBlurred
								/>
								<div id="contact">
									<div id="contact_info" className="flex py-5">
										<Github
											width={42}
											height={42}
											className="mx-2  fill-slate-300"
										/>
										<LinkedIn
											width={42}
											height={42}
											className="mx-2  fill-slate-300"
										/>
										<Instagram
											width={42}
											height={42}
											className="mx-2  fill-slate-300"
										/>
									</div>
									<div
										id="about_site"
										className=" hidden lg:visible text-base text-slate-500"
									>
										Built by yours truly with NextJS, and react. Coded in
										VSCode. Deployed in Vercel
									</div>
								</div>
							</div>
						</div>
						<div
							id="page"
							className="grid lg:min-h-screen  "
							style={{
								gridTemplateRows: "auto 2fr",
							}}
						>
							<div
								id="nav"
								className="pb-10 lg:pt-20 self-start justify-self-center"
							>
								<NavBar />
							</div>
							<div id="dataholder">{children}</div>
						</div>
						{/* <div
				style={{
					backgroundImage: "url(/texture.jpg)",
					backgroundBlendMode: "color-burn",
				}}
				className=" absolute right-0 left-0 top-0 bottom-0 bg-cover bg-no-repeat bg-center bg-slate-700"
			></div> */}
						{/* <CardHolder cardStack={cardStack} sendCardToBack={sendCardToBack} /> */}
					</div>
				</Providers>
			</body>
		</html>
	);
}
