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
					svg: "w-24 h-24",
				}}
				color="default"
				valueLabel={
					<div className="text-xl font-semibold">{progress / 10}/10</div>
				}
				showValueLabel
			/>
			<div className="text-md  font-medium text-center">{label}</div>
		</div>
	);
}
