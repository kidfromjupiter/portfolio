"use client";

import { Fira_Code } from "next/font/google";
import React, { useMemo, useState } from "react";

const firacode = Fira_Code({
  subsets: ["latin"],
  weight: ["400", "700"],
});
export type HistoryEntry = {
  timestamp: string; // ISO string, e.g. "2025-11-20T10:15:00Z"
  text: string;
  link?: string;
};

interface TerminalHistoryProps {
  entries: HistoryEntry[];
}

export function TerminalHistory({ entries }: TerminalHistoryProps) {
  const [query, setQuery] = useState("");

  // Sort newest → oldest
  const sortedEntries = useMemo(
    () =>
      [...entries].sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ),
    [entries]
  );

  // Filter by search query (case-insensitive)
  const filteredEntries = useMemo(() => {
    if (!query.trim()) return sortedEntries;

    const q = query.toLowerCase();
    return sortedEntries.filter((entry) => {
      return (
        entry.text.toLowerCase().includes(q) ||
        entry.timestamp.toLowerCase().includes(q)
      );
    });
  }, [sortedEntries, query]);

  return (
    <div
      className={`${firacode.className} w-full border border-zinc-800 bg-[#70938a] text-zinc-100 shadow-lg flex flex-col overflow-auto`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 px-3 py-2 text-xs">
        <span className="font-mono text-[10px] text-zinc-800">
          {entries.length} entries
        </span>
      </div>

      {/* Search */}
      <div className="border-b border-zinc-800 px-3 py-2">
        <div className="flex items-center gap-2 bg-zinc-900 px-2">
          <span className="font-mono text-xs text-emerald-400">$</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="search history…"
            className="h-7 w-full bg-transparent font-mono text-xs text-zinc-100 outline-none placeholder:text-zinc-500"
          />
        </div>
      </div>

      {/* List */}
      <div className=" overflow-y-auto px-3 py-2 text-sm flex flex-col">
        {filteredEntries.length === 0 ? (
          <div className="py-4 text-center font-mono text-[11px] text-zinc-800">
            no matching entries
          </div>
        ) : (
          <ul className="space-y-1.5">
            {filteredEntries.map((entry, idx) => {
              const date = new Date(entry.timestamp);
              const formatted = date.toLocaleString(undefined, {
                year: "2-digit",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <li
                  key={`${entry.timestamp}-${idx}`}
                  className="font-mono hover:cursor-pointer"
                  onClick={() => window.open(entry.link, "_blank")}
                >
                  <span className="mr-2 text-[10px] text-zinc-800">
                    [{formatted}]
                  </span>
                  <span className="text-[#2f4858] font-bold">
                    lasan@portfolio ~ $
                  </span>
                  <span className="ml-2 text-zinc-100">{entry.text}</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
