"use client";

import { HistoryEntry } from "@/components/TerminalHistory";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type FolioHistoryContextValue = {
  updates: HistoryEntry[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

const FolioHistoryContext = createContext<FolioHistoryContextValue | undefined>(
  undefined
);

async function fetchFolioUpdates(): Promise<HistoryEntry[]> {
  const res = await fetch("/api/twitter-api", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    // optional: avoid using any cache so it's always fresh
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to fetch folio updates");
  }

  return res.json();
}

export function FolioHistoryProvider({ children }: { children: ReactNode }) {
  const [updates, setUpdates] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchFolioUpdates();
      setUpdates(data);
    } catch (err: any) {
      console.error("Error fetching folio updates:", err);
      setError(err?.message ?? "Failed to load folio updates");
    } finally {
      setLoading(false);
    }
  };

  // initial load
  useEffect(() => {
    void refresh();
  }, []);

  const value: FolioHistoryContextValue = {
    updates,
    loading,
    error,
    refresh,
  };

  return (
    <FolioHistoryContext.Provider value={value}>
      {children}
    </FolioHistoryContext.Provider>
  );
}

export function useFolioHistory() {
  const ctx = useContext(FolioHistoryContext);
  if (!ctx) {
    throw new Error(
      "useFolioHistory must be used within a FolioHistoryProvider"
    );
  }
  return ctx;
}
