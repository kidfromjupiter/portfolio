"use client";
import Card from "@/components/card";
import CardHolder from "@/components/cardholder";
import {
	useMotionValue,
	LayoutGroup,
	motion,
	useTransform,
} from "framer-motion";
import { useState } from "react";
import { Image } from "@nextui-org/react";
import NextImage from "next/image";
import Github from "@/icons/Github";
import LinkedIn from "@/icons/LinkedIn";
import Instagram from "@/icons/Instagram";
export default function Home({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex flex-col items-center justify-center">
			<div className="pb-10 bg-clip-text bg-gradient-to-br from-amber-400 to-amber-500 text-transparent text-4xl font-bold">
				My Journey in Code
			</div>
			<div className="text-slate-400 text-xl  px-16">
				<p>
					I’ve been programming since i was 12 years old. I stumbled upon the
					world of programming while struggling to install a game on my dad's
					laptop. Not knowing heads or tails about the errors it was giving me,
					I inevitably turned to google. Which forced me down a rabbit hole of
					code. fast forward 8 years and here I am.
				</p>
				<br />
				<p>
					My main focus these days is improving on my craft and learning new
					things. Work revolves around django, react and new web technologies
					that popup here and there. Wanna know what i've been upto? check out
					my projects.
				</p>
				<br />
				<p>
					Whenever I'm not working, I'm probably off playing Skyrim or spending
					copious amounts of money buying arduinos and reverse engineering
					drivers for linux.
				</p>
			</div>
		</div>
	);
}
