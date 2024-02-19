export default function SkillCard({
	children,
	title,
}: {
	children: Array<React.ReactNode>;
	title: string;
}) {
	return (
		<div className="lg:py-1 flex flex-col md:flex-row lg:block items-center py-5">
			<h1 className=" font-bold  text-2xl p-3 pb-5 md:w-[20vw]">{title}</h1>
			<div className="flex ">{children}</div>
		</div>
	);
}
