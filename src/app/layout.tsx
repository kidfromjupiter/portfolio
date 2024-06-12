import "./globals.css";
import { Metadata } from "next";
import localFont from "next/font/local";
const inter = localFont({
  src: "../fonts/Inter/inter.ttf",
  display:"swap"
})

export const metadata: Metadata = {
	title: "Lasan Mahaliyana",
	description: "Lasan Mahaliyana's personal portfolio",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			lang="en"
			className="dark"
			style={
				{
					// fontSize: "16px",
				}
			}
		>
			<body className={inter.className}>
        {children}
			</body>
		</html>
	);
}
