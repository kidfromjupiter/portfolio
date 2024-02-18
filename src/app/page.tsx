"use client";

export default function Home({ children }: any) {
	return (
		<div className="flex flex-col items-center justify-center">
			<div className="pb-10 bg-clip-text bg-gradient-to-br from-amber-400 to-amber-500 text-transparent text-4xl font-bold">
				My Journey in Code
			</div>
			<div className="text-slate-400 text-xl  px-16">
				<p>
					I&apos;ve been programming since I was 12 years old. I stumbled upon
					the world of programming while struggling to install a game on my
					dad&apos;s laptop. Not knowing heads or tails about the errors it was
					giving me, I inevitably turned to google. Which forced me down a
					rabbit hole of code. fast forward 8 years and here I am.
				</p>
				<br />
				<p>
					My main focus these days is improving on my craft and learning new
					things. Work revolves around django, react and new web technologies
					that popup here and there. Wanna know what I&apos;ve been upto? check
					out my projects.
				</p>
				<br />
				<p>
					Whenever I&apos;m not working, I&apos;m probably off playing Skyrim or
					spending copious amounts of money buying arduinos and reverse
					engineering drivers for linux.
				</p>
			</div>
		</div>
	);
}
