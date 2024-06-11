import Check from "@/icons/Check";

export default function Others({ name }: { name: string }) {
	return (
		<div className="flex pb-1">
			<Check height={24} width={24} className="stroke-slate-400 mx-2" />
			<h1>{name}</h1>
		</div>
	);
}
