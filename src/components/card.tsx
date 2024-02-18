"use client";
import { motion, useMotionValue, useTransform } from "framer-motion";
export default function Card({ card, index, sendCardToBack }: any) {
	const constraints = 150;
	const offsetX = useMotionValue(0);
	const twist = useTransform(
		offsetX,
		[-constraints, 0, constraints],
		["-30deg", "0deg", "30deg"]
	);
	const opacity = useTransform(
		offsetX,
		[-constraints, 0, constraints],
		[0, 1, 0]
	);

	return (
		<motion.div
			layout
			className=" h-96 w-64 flex items-center justify-center m-3 rounded-xl absolute bg-slate-100 select-none"
			style={{ opacity: opacity, rotate: twist }}
			key={card.id}
			drag={index == 2 ? "x" : false}
			dragSnapToOrigin
			dragElastic={1}
			onUpdate={(latest) => {
				// @ts-ignore:
				offsetX.set(latest.x);
			}}
			onDrag={(event, info) => {
				if (info.offset.x > constraints || info.offset.x < -constraints) {
					sendCardToBack();
				}
			}}
			whileTap={{ scale: 1.1 }}
		>
			{card.component}
		</motion.div>
	);
}
