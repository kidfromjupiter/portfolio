"use client";
import Others from "@/components/Others";
import Othersholder from "@/components/OthersHolder";
import ProgressHolder from "@/components/Progressholder";
import SkillCard from "@/components/SkillCard";
import { CircularProgress, Tabs, Tab, Card } from "@nextui-org/react";
export default function Skills() {
	return (
		<div className="flex flex-col  items-center overflow-auto">
			<Tabs
				classNames={{
					base: "justify-center",
				}}
			>
				<Tab key="main" title="Main">
					<SkillCard title="Frontend">
						<ProgressHolder label="React" progress={90} />
						<ProgressHolder label="Next.js" progress={70} />
						<ProgressHolder label="Django Templates" progress={60} />
					</SkillCard>
					<SkillCard title="Backend">
						<ProgressHolder label="Django" progress={80} />
						<ProgressHolder label="REST APIs" progress={70} />
					</SkillCard>
					<SkillCard title="Languages">
						<ProgressHolder label="C++" progress={30} />
						<ProgressHolder label="Python" progress={70} />
						<ProgressHolder label="JavaScript" progress={80} />
					</SkillCard>
				</Tab>
				<Tab key="others" title="Others" className="">
					<div className="text-xl text-slate-500 px-10 pt-5">
						Other technologies/frameworks/software I have experience using
					</div>
					<div className="flex-col pb-10">
						<Othersholder title="Frontend/Design">
							<Others name="Figma" />
							<Others name="TailwindCSS" />
							<Others name="Bootstrap" />
						</Othersholder>
						<Othersholder title="Hosting">
							<Others name="AWS" />
							<Others name="Vercel" />
							<Others name="Heroku" />
						</Othersholder>
						<Othersholder title="API Design">
							<Others name="Postman" />
							<Others name="Insomnia" />
						</Othersholder>
						<Othersholder title="CI/CD and other devtools">
							<Others name="Git" />
							<Others name="CircleCI" />
						</Othersholder>
					</div>
				</Tab>
			</Tabs>
		</div>
	);
}
