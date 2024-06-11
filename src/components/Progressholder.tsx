import { CircularProgress } from "@nextui-org/react";

export default function ProgressHolder({
	label,
	progress,
}: {
	label: string;
	progress: number;
}) {
	return (
		<div className="flex flex-col items-center justify-center px-5">
			<CircularProgress
				size="lg"
				value={progress}
				classNames={{
					svg: "w-16 h-16 md:w-24 md:h-24",
				}}
				color="default"
				valueLabel={
					<div className="text-base md:text-xl font-semibold">
						{progress / 10}/10
					</div>
				}
				showValueLabel
			/>
			<div className="text-md  font-medium text-center">{label}</div>
		</div>
	);
}
