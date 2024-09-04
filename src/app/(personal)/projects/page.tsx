"use client";

import { useRef, useState } from "react";
import ProjectCard from "@/components/ProjectCard";
export default function Projects() {
	const [cardStack, setCardStack] = useState<
		Array<{ id: number; component: React.ReactNode }>
	>([
		{
			id: 1,
			component: (
				<ProjectCard
					name="Taste"
					desc="E-commerce platform"
					image="/taste.png"
					link="https://taste.lasan.digital"
					tags={[
						"Django",
						"Docker",
						"React",
						"Vercel",
						"Figma",
						"django-rest-framework",
						"framer-motion",
					].map((tag, i) => (
						<div
							key={i}
							className="rounded bg-sky-600 py-0.5 px-2  mx-0.5 my-0.5"
						>
							{tag}
						</div>
					))}
				/>
			),
		},
		{
			id: 2,
			component: (
				<ProjectCard
					name="Portals"
					desc="Chat application"
					image="/portals.png"
					link="https://portals.lasan.digital"
					tags={[
						"Django",
						"React",
						"Vercel",
						"Figma",
						"django-rest-framework",
						"framer-motion",
						"django-channels",
						"Docker",
					].map((tag, i) => (
						<div
							key={i}
							className="rounded bg-sky-600 py-0.5 px-2  mx-0.5 my-0.5"
						>
							{tag}
						</div>
					))}
				/>
			),
		},
	]);

	return (
		<div className="w-full h-full  relative m-auto py-10">
			{cardStack.map((card, i) => {
				return (
					<div className="pb-5 flex flex-col items-center" key={i}>
						{card.component}
					</div>
				);
			})}
		</div>
	);
}
