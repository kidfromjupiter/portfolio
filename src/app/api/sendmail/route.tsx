import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import type { NextApiRequest, NextApiResponse } from "next";
export async function POST(req, res) {
	try {
		const { email, description } = await req.json();
		const transporter = nodemailer.createTransport({
			host: "smtp-relay.brevo.com",
			port: 587,
			secure: false,
			auth: {
				user: process.env.SENDER_USER,
				pass: process.env.SENDER_PW,
			},
		});
		const mailOptions = {
			from: process.env.SENDER_USER,
			to: process.env.SENDER_USER,
			subject: "New message from portfolio",
			text: "Email: " + email + "\n\n" + description,
		};
		const info = await transporter.sendMail(mailOptions);
		return NextResponse.json({ message: "Email sent", success: true });
	} catch (error) {
		return NextResponse.json({
			message: JSON.stringify(error),
			success: false,
		});
	}
}
