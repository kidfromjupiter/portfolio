"use client";

import { useState } from "react";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, User } from "lucide-react";
import { Label } from "./ui/label";
import { Jersey_10 } from "next/font/google";

const jersey10 = Jersey_10({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export function ContactMeCard() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setError("Please write a message.");
      setStatus("error");
      return;
    }

    setStatus("sending");
    setError("");

    const bodyLines = [
      `From: ${name || "Anonymous"} <${email || "no-email"}>`,
      "",
      message,
    ];
    try {
      await fetch(`https://ntfy.sh/5604558779portfolio`, {
        method: "POST",
        body: bodyLines.join("\n"),
        headers: {
          Title: "New message from portfolio",
          Tags: "email,portfolio",
          Priority: "urgent",
        },
      });

      setStatus("success");
      setMessage("");
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? "Something went wrong");
      setStatus("error");
    }
  };

  return (
    <div className={`w-full bg-transparent ${jersey10.className}`}>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            {/* Name group */}
            <div className="space-y-1">
              <Label htmlFor="name" className="text-xl">
                Name
              </Label>
              <div className="flex items-center gap-2 border border-zinc-800 bg-background/80 px-3 py-[2px] focus-within:ring-2 focus-within:ring-zinc-500/60 focus-within:ring-offset-0">
                <User className="h-4 w-4 text-zinc-500" />
                <Input
                  id="name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 h-8 text-md md:text-lg"
                />
              </div>
            </div>

            {/* Email group */}
            <div className="space-y-1">
              <Label htmlFor="email" className="text-xl">
                Email
              </Label>
              <div className="flex items-center gap-2 border border-zinc-800 bg-background/80 px-3 py-[2px] focus-within:ring-2 focus-within:ring-zinc-500/60 focus-within:ring-offset-0">
                <Mail className="h-4 w-4 text-zinc-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 h-8 text-md md:text-lg"
                />
              </div>
              <p className="mt-1 text-sm text-zinc-500">
                Optional, but helpful if I need to reply.
              </p>
            </div>
          </div>

          {/* Message (kept as full-width textarea) */}
          <div className="space-y-1">
            <Label htmlFor="message" className="text-xl">
              Message
            </Label>
            <Textarea
              id="message"
              placeholder="What do you want to talk about?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              className="bg-background/80 resize-none text-lg md:text-lg"
              required
            />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col items-start gap-2 md:flex-row md:items-center md:justify-between">
          <Button
            type="submit"
            disabled={status === "sending"}
            className="inline-flex items-center gap-2"
          >
            {status === "sending" && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            {status === "sending" ? "Sending…" : "Send message"}
          </Button>

          <div className="text-md min-h-[1.25rem] ">
            {status === "success" && (
              <span className="text-[#3c665c]">
                Message sent. I’ll get back to you soon.
              </span>
            )}
            {status === "error" && (
              <span className="text-red-400">
                {error || "Something went wrong. Try again."}
              </span>
            )}
          </div>
        </CardFooter>
      </form>
    </div>
  );
}
