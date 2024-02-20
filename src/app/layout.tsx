import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

import { Image, Tabs, Tab } from "@nextui-org/react";
import NextImage from "next/image";
import Github from "@/icons/Github";
import LinkedIn from "@/icons/LinkedIn";
import Instagram from "@/icons/Instagram";
import NavBar from "@/components/Navbar";
import { Metadata } from "next";
const inter = Inter({ subsets: ["latin"] });

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
					<div
						className="px-5 md:px-10 py-5 lg:py-0  grid grid-rows-[0.2fr_0.8fr] lg:grid-cols-[0.5fr_50px_0.5fr] lg:grid-rows-1  justify-between  bg-cover bg-center bg-no-repeat bg-slate-900 overflow-auto h-screen "
						style={{
							backgroundImage: "url(/texture.jpg)",
							backgroundBlendMode: "color-burn",
						}}
					>
						<div
							id="infoholder"
							className="flex lg:min-h-screen flex-col md:flex-row lg:flex-col justify-evenly "
						>
							<div id="general_about" className="px-5">
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
								<div id="about_small" className="text-xl text-slate-500">
									I build performant web applications for clients and help
									create scalable, robust platforms
								</div>
							</div>
							<div
								id="photo_and_contact"
								className="px-5 flex flex-col justify-center items-center pt-10 md:pt-0 md:justify-normal md:items-start "
							>
								<Image
									as={NextImage}
									width={200}
									height={320}
									src="/me.jpg"
									alt="NextUI hero Image"
									isBlurred
								/>
								<div id="contact">
									<div
										id="contact_info"
										className="flex py-5 items-center justify-center md:justify-normal"
									>
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
										className=" hidden lg:block text-base text-slate-500"
									>
										Designed and developed by yours truly with NextJS, and
										react. Coded in VSCode. Deployed in Vercel
									</div>
								</div>
							</div>
						</div>
						<div className="h-full w-full hidden lg:flex  justify-center items-center">
							<div className=" justify-self-center border-slate-700  h-[70vh] w-[1px] border-1"></div>
						</div>
						<div
							id="page"
							className="grid lg:h-[100vh] pt-5 md:pt-16 lg:pt-0"
							style={{
								gridTemplateRows: "auto 2fr",
							}}
						>
							<div
								id="nav"
								className="pb-5 lg:pt-14 self-start justify-self-center"
							>
								<NavBar />
							</div>

							<div id="dataholder" className="lg:overflow-auto">
								{children}
							</div>
						</div>
					</div>
				</Providers>
			</body>
		</html>
	);
}
