"use client";
import Check from "@/icons/Check";
import { Input } from "@nextui-org/react";
import { Textarea } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { useRef, useState } from "react";
export default function Contact() {
	const email = useRef<HTMLInputElement>(null);
	const description = useRef<HTMLTextAreaElement>(null);

	const [success, setSuccess] = useState(false);
	const [loading, setLoading] = useState(false);
	return (
		<div className="flex w-full flex-col gap-4 h-full py-10 px-8 xl:px-24">
			<Input type="email" label="Email" ref={email} />
			<Textarea
				label="Description"
				placeholder="What do you want to talk about?"
				ref={description}
			/>
			<div className=" w-full j">
				<div className="text-slate-500 pb-5 text-center">
					I usually get back to you within 24 hours.
				</div>
				<Button
					isLoading={loading}
					color="primary"
					endContent={
						success ? (
							<Check
								width={30}
								height={30}
								className="stroke-white"
								fill="transparent"
							/>
						) : null
					}
					onClick={() => {
						setLoading(true);
						fetch("/api/sendmail", {
							method: "POST",
							body: JSON.stringify({
								email: email.current?.value,
								description: description.current?.value,
							}),
							headers: {
								"Content-Type": "application/json",
							},
						}).then((e) => {
							{
								setLoading(false);
								setSuccess(true);
								setTimeout(() => {
									setSuccess(false);
								}, 4000);
							}
						});
					}}
				>
					{success ? "Sent" : "Send"}
				</Button>
			</div>
		</div>
	);
}
