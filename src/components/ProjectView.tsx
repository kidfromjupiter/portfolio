"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Jersey_10 } from "next/font/google";
import { NpmSpinnerLoaderRegular } from "./NpmLoaderRegular";
import { Project } from "@/app/api/projects/route";

const jersey10 = Jersey_10({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

type Status = "ongoing" | "abandoned" | "finished";

function formatDate(dateStr: string | null) {
  if (!dateStr) return "Unknown";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "Unknown";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
// Detect http(s) URLs and turn them into <a> tags
function linkifyLine(line: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = line.split(urlRegex);

  return parts.map((part, index) => {
    if (/^https?:\/\/[^\s]+$/.test(part)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-2 text-sky-300 hover:text-sky-200 break-words"
        >
          {part}
        </a>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

// Preserve line breaks + linkify URLs
function renderDescription(text: string) {
  const lines = text.split(/\r?\n/);
  return lines.map((line, lineIndex) => (
    <span key={lineIndex}>
      {linkifyLine(line)}
      {lineIndex < lines.length - 1 && <br />}
    </span>
  ));
}
function statusStyles(status: Status) {
  switch (status) {
    case "ongoing":
      return "bg-emerald-500 text-emerald-100 border-emerald-500/50";
    case "finished":
      return "bg-sky-500 text-sky-100 border-sky-300/50";
    case "abandoned":
      return "bg-amber-500 text-amber-300 border-amber-500/40";
    default:
      return "bg-zinc-700/ text-zinc-200 border-zinc-600/80";
  }
}

export function ProjectsScroller() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch("/api/projects", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || "Failed to load projects");
        }
        const data = await res.json();

        // Sort projects: ongoing first, then others
        const sortedProjects = data.sort((a: Project, b: Project) => {
          if (a.status === "ongoing" && b.status !== "ongoing") return -1;
          if (a.status !== "ongoing" && b.status === "ongoing") return 1;
          return 0;
        });

        setProjects(sortedProjects);
      } catch (err: any) {
        console.error(err);
        setError(err?.message ?? "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  if (loading) {
    return (
      <div
        className={`border-zinc-800 flex flex-col items-center justify-center ${jersey10.className}`}
      >
        <NpmSpinnerLoaderRegular overlay={false} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`border-zinc-800 flex flex-col ${jersey10.className}`}>
        <CardHeader>
          <p className="text-red-300 text-sm font-medium">
            Error loading projects
          </p>
        </CardHeader>
        <CardContent>
          <p className="text-red-200/80 text-sm">{error}</p>
        </CardContent>
      </div>
    );
  }

  if (!projects.length) {
    return (
      <div className={`border-zinc-800 flex flex-col ${jersey10.className}`}>
        <CardContent className="text-sm text-zinc-400">
          No projects found. Add <code>folio.yml</code> to your repos to show
          them here.
        </CardContent>
      </div>
    );
  }

  return (
    <div
      className={`border-zinc-800 flex flex-col ${jersey10.className} overflow-auto`}
    >
      {/* Scrollable list of project cards */}
      <CardContent
        className="pt-0 flex-1 overflow-y-auto pr-1 space-y-4 md:px-10"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#727272ff transparent",
        }}
      >
        {projects.map((p) => (
          <Card
            key={p.slug}
            className="bg-[#70938a] border-zinc-800/90 transition-colors overflow-hidden flex flex-col"
          >
            {/* Header thumbnail */}
            {p.thumbnail ? (
              <CardHeader className="p-0">
                <div className="relative w-full h-40 md:h-52 overflow-hidden bg-zinc-900">
                  {/* swap with next/image if you like */}
                  <img
                    src={p.thumbnail}
                    alt={p.title}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.03]"
                    loading="lazy"
                  />
                </div>
              </CardHeader>
            ) : (
              <CardHeader className="p-0">
                <div className="w-full h-32 md:h-40 bg-zinc-900/80 border-b border-zinc-800/80 flex items-center justify-center text-[11px] text-zinc-600">
                  No thumbnail
                </div>
              </CardHeader>
            )}

            {/* Body */}
            <CardContent className="pt-4 pb-3 flex flex-col gap-3">
              {/* Title + status */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1 min-w-0">
                  <h3
                    className="text-2xl font-semibold text-zinc-50 break-words tracking-[2px]"
                    style={{ textShadow: "1px 1px #000000" }}
                  >
                    {p.title}
                  </h3>
                </div>

                <span
                  className={
                    "mt-1 whitespace-nowrap text-[#6FA4AF] border px-2 py-[2px] text-[10px] font-mono uppercase tracking-[0.14em] " +
                    statusStyles(p.status)
                  }
                >
                  {p.status}
                </span>
              </div>

              {/* Description – vertical, multi-line */}
              <p className="text-md md:text-lg text-zinc-200 whitespace-pre-line leading-relaxed">
                {renderDescription(p.description)}
              </p>

              {!p.noRepo && (
                <a
                  href={p.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-zinc-600 underline-offset-2 hover:text-zinc-200 hover:underline"
                >
                  View on GitHub
                </a>
              )}
            </CardContent>

            {/* Footer meta */}
            {p.status !== "finished" && (
              <CardFooter className="pt-0 pb-3 px-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-lg text-zinc-800 border-t border-zinc-800/70">
                <span>
                  Started:{"  "}
                  <span className="text-zinc-100">
                    {formatDate(p.startedAt)}
                  </span>
                </span>
                <span>
                  Last active:{"  "}
                  <span className="text-zinc-100">
                    {formatDate(p.lastActiveAt)}
                  </span>
                </span>
              </CardFooter>
            )}
          </Card>
        ))}
      </CardContent>
    </div>
  );
}
