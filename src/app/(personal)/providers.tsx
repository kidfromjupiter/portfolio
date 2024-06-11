// app/providers.tsx
"use client";

import { NextUIProvider } from "@nextui-org/react";
import { useRouter } from "next/navigation";

export function Providers({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	return (
		<NextUIProvider navigate={(path) => router.push(path, { scroll: false })}>
			{children}
		</NextUIProvider>
	);
}
