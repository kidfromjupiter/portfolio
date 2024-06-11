export default function Othersholder({
	children,
	title,
}: {
	children: Array<React.ReactNode>;
	title: string;
}) {
	return (
		<div className="lg:py-1 px-3 items-center py-5 justify-center">
			<h1 className=" font-bold  text-2xl p-3 pb-5 ">{title}</h1>
			<div className="flex flex-col pl-5 ">{children}</div>
		</div>
	);
}
