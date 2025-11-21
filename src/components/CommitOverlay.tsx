"use client";

import { Fira_Code } from "next/font/google";
import { useEffect, useState } from "react";

type ProfileCommit = {
  sha: string;
  url: string;
  message: string;
  repo: string;
  date: string | null;
};

type ApiResponse = {
  commits: ProfileCommit[];
  total: number;
  page: number;
  perPage: number;
  from: string;
  to: string;
  error?: string;
};

const firacode = Fira_Code({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export function GitProfileCommitsPopup() {
  const [open, setOpen] = useState(false);
  const [commits, setCommits] = useState<ProfileCommit[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [from, setFrom] = useState<string | null>(null);
  const [to, setTo] = useState<string | null>(null);

  const fetchPage = async (pageToLoad: number, replace = false) => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams({
        page: String(pageToLoad),
        perPage: "25",
        // from: "2025-06-01",
        // to: "2025-12-31",
      });

      const res = await fetch(`/api/profile-commits?${params.toString()}`);
      const data: ApiResponse = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to load commits");
      }

      setFrom(data.from);
      setTo(data.to);

      if (replace) {
        setCommits(data.commits);
      } else {
        setCommits((prev) => [...prev, ...data.commits]);
      }

      setPage(data.page);
      const loadedSoFar = (pageToLoad - 1) * data.perPage + data.commits.length;
      setHasMore(loadedSoFar < data.total);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load commits");
    } finally {
      setLoading(false);
    }
  };

  // Load first page once on mount (works for both small + large devices)
  useEffect(() => {
    if (commits.length === 0) {
      fetchPage(1, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleOpen = () => {
    setOpen((prev) => !prev);
  };

  const loadMore = () => {
    if (!hasMore || loading) return;
    fetchPage(page + 1);
  };

  return (
    <>
      {/* Floating toggle button - only on small screens */}
      <button
        onClick={toggleOpen}
        className="fixed bottom-5 right-5 z-40 rounded-full bg-zinc-950/90 px-4 py-2 text-xs font-mono text-zinc-300  backdrop-blur-sm hover:bg-zinc-900/90 lg:hidden"
      >
        {open ? "close git log" : 'git log --author="me"'}
      </button>

      {/* Popup panel */}
      <div
        className={[
          `${firacode.className} ` +
            "fixed right-5 z-40 flex w-[420px] max-w-[calc(100%-2.5rem)] flex-col font-mono text-xs text-zinc-100  backdrop-blur-sm transition-all duration-200 bg-zinc-950/90 lg:bg-transparent",
          // Small screens: controlled by `open`
          open
            ? "bottom-16 opacity-100 translate-y-0"
            : "bottom-5 opacity-0 pointer-events-none translate-y-4",
          // Large screens: always visible + interactive
          "lg:bottom-16 lg:opacity-100 lg:translate-y-0 lg:pointer-events-auto",
        ].join(" ")}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2">
          <div className="space-y-0.5">
            <p className="text-[11px] text-zinc-400">
              git log --author="kidfromjupiter"
            </p>
            {from && to && (
              <p className="text-[10px] text-zinc-500">
                committer-date: {from}..{to}
              </p>
            )}
          </div>
          {/* esc button only on small screens so you can't hide it on large */}
          <button
            onClick={toggleOpen}
            className="rounded px-2 py-0.5 text-[10px] text-zinc-400 hover:text-zinc-100 lg:hidden"
          >
            esc
          </button>
        </div>

        {/* Scrollable list */}
        <div
          className="max-h-[50vh] overflow-y-auto"
          style={{
            WebkitMaskImage: "linear-gradient(to top, transparent, black 30%)",
            maskImage: "linear-gradient(to top, transparent, black 30%)",
          }}
        >
          {loading && !commits.length && (
            <div className="px-3 py-2 text-zinc-400">loading commits…</div>
          )}

          {error && <div className="px-3 py-2 text-red-400">{error}</div>}

          {commits.map((c) => (
            <a
              key={c.sha}
              href={c.url}
              target="_blank"
              rel="noreferrer"
              className="block px-3 py-2 "
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-400">
                  {c.sha.slice(0, 7)}
                </span>
                <span className="md:bg-zinc-800/70  bg-zinc-800/70 px-2 py-0.5 text-[10px] text-zinc-300">
                  {c.repo}
                </span>
                <span className="text-[11px] text-zinc-300 lg:text-zinc-800">
                  {c.message}
                </span>
              </div>
              <div className="mt-1 text-[10px] text-zinc-500">
                {c.date ? new Date(c.date).toLocaleString() : "unknown date"}
              </div>
            </a>
          ))}

          {!loading && !commits.length && !error && (
            <div className="px-3 py-2 text-zinc-400">
              no commits found in this range
            </div>
          )}
        </div>

        {/* Footer / pagination */}
        <div className="flex items-center justify-between px-3 py-1.5 text-[10px] text-zinc-500">
          <span>
            page {page}
            {hasMore ? "" : " · end"}
          </span>
          {hasMore && (
            <button
              onClick={loadMore}
              disabled={loading}
              className="rounded border border-zinc-700 px-2 py-0.5 hover:bg-zinc-800 disabled:opacity-50"
            >
              {loading ? "loading…" : "load more"}
            </button>
          )}
        </div>
      </div>
    </>
  );
}
