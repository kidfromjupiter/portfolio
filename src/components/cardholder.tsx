import Card from "./card";
import { motion } from "framer-motion";
export default function CardHolder({
	cardStack,
	sendCardToBack,
}: {
	cardStack: Array<{ id: number; component: React.ReactNode }>;
	sendCardToBack: () => void;
}) {
	return (
		<div className="flex justify-center items-center relative min-h-screen w-full m-10">
			{cardStack
				.slice(0, 3)
				.reverse()
				.map((card, index) => (
					<motion.div
						layout
						initial={{ opacity: 0 }}
						animate={{ opacity: 0.333333 * (index + 1), y: index * -10 }}
						key={card.id}
						className="shadow-lg "
					>
						<Card card={card} index={index} sendCardToBack={sendCardToBack} />
					</motion.div>
				))}
		</div>
	);
}
