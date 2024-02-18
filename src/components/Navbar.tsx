"use client";
import { Tab, Tabs } from "@nextui-org/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBar({}: any) {
	const pathname = usePathname();
	return (
		<Tabs
			classNames={{
				tabContent: "group-data-[selected=true]:text-amber-950",
				cursor: "dark:bg-gradient-to-br dark:from-amber-400 dark:to-amber-500 ",
				tabList: "dark:bg-slate-800",
			}}
			selectedKey={pathname}
			// children={(item) => {
			// 	return <Link/>
			// }}
		>
			<Tab as={Link} title="About me" href="/" key="/"></Tab>
			<Tab as={Link} title="Skills" href="/skills" key="/skills"></Tab>
			<Tab as={Link} title="Projects" href="/projects" key="/projects"></Tab>
			<Tab as={Link} title="Contact" href="/contact" key="/contact"></Tab>
			{/* <Tab key={"/"} />
			<Tab
				key={"/projects"}
				// title="Projects"
			/>
			<Tab
				key={"/skills"}
				// title="Skills"
			/>
			<Tab
				key={"/contact"}
				// title="Contact"
			/> */}
		</Tabs>
	);
}
