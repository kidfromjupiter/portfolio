import RightArrow from "@/icons/RightArrow";
import { Image } from "@nextui-org/react";
import NextImage from "next/image";
import Link from "next/link";

export default function ProjectCard({
	name,
	desc,
	image,
	tags,
	link,
}: {
	name: string;
	desc: string;
	image: string;
	tags: Array<React.ReactNode>;
	link: string;
}) {
	return (
		<div className="bg-slate-900 rounded-xl p-5 flex flex-col w-[360px]">
			<div className="flex flex-col py-3">
				<span className="  text-4xl bg-clip-text text-transparent bg-gradient-to-r  from-amber-400 to-amber-500 font-bold">
					{name}
				</span>
				<div className="text-xl">{desc}</div>
			</div>
			<Image
				as={NextImage}
				width={340}
				height={230}
				src={image}
				classNames={{
					wrapper: " py-5 px-4",
				}}
			/>
			<div className="flex flex-wrap py-3">
				{"Tags:  "}
				{tags.map((tag: React.ReactNode) => tag)}
			</div>
			<Link href={link}>
				<div className="text-xl font-medium text-center text-amber-400 flex items-center justify-center pt-5">
					Take me there
					<RightArrow width={24} height={24} className=" stroke-amber-400" />
				</div>
			</Link>
		</div>
	);
}
