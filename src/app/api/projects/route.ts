// app/api/projects/route.ts
import { NextResponse } from "next/server";
// @ts-ignore
import yaml from "js-yaml";

export const runtime = "nodejs";
export const revalidate = 3600; // cache for 1 hour

const GITHUB_API = "https://api.github.com";
const { GITHUB_TOKEN: GITHUB_ACCESS_TOKEN, GITHUB_USERNAME } = process.env;

type Status = "active" | "abandoned" | "finished";

type FolioYaml = {
  title: string;
  description: string;
  status: Status;
  startedAt?: string;
  thumbnail?: string;
};

type Project = {
  slug: string;
  title: string;
  description: string;
  status: Status;
  startedAt: string | null;
  lastActiveAt: string | null;
  thumbnail: string | null;
  repoUrl: string;
};

function ghHeaders() {
  if (!GITHUB_ACCESS_TOKEN) {
    throw new Error("GITHUB_TOKEN not set");
  }
  return {
    Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

async function listRepos() {
  // Uses authenticated /user/repos so you don't hard-code your handle.
  const res = await fetch(`${GITHUB_API}/user/repos?per_page=100`, {
    headers: ghHeaders(),
    // let Next.js cache this call too
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to list repos: ${res.status} ${await res.text()}`);
  }

  const repos = await res.json();
  return repos as any[];
}

async function getFolioYaml(owner: string, repo: string) {
  const path = "folio.yml";

  const res = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`,
    {
      headers: ghHeaders(),
    }
  );

  if (res.status === 404) {
    return null; // no folio.yml here
  }

  if (!res.ok) {
    throw new Error(
      `Failed to fetch folio.yml for ${owner}/${repo}: ${
        res.status
      } ${await res.text()}`
    );
  }

  const contentJson = await res.json();
  const encoded = contentJson.content as string;
  const decoded = Buffer.from(encoded, "base64").toString("utf8");

  const data = yaml.load(decoded) as FolioYaml;
  return data;
}

export async function GET() {
  if (!GITHUB_ACCESS_TOKEN) {
    return NextResponse.json(
      { error: "GITHUB_TOKEN not configured" },
      { status: 500 }
    );
  }

  try {
    const repos = await listRepos();

    // Only include repos you care about (optionally filter by owner, visibility, etc.)
    const visibleRepos = repos.filter((r) => !r.archived);

    const projects: Project[] = [];

    // Fetch folio.yml for each repo in parallel
    await Promise.all(
      visibleRepos.map(async (repo) => {
        const owner = repo.owner.login as string;
        const name = repo.name as string;

        const folio = await getFolioYaml(owner, name);
        if (!folio) return; // skip repos without folio.yml

        // Basic validation
        if (!folio.title || !folio.description || !folio.status) return;

        // Derive last active date from repo metadata
        const lastActiveAt = repo.pushed_at ?? null;

        // Resolve thumbnail as absolute URL if it looks like a relative path
        let thumbnail: string | null = folio.thumbnail ?? null;
        if (thumbnail && !thumbnail.startsWith("http")) {
          const defaultBranch = repo.default_branch || "main";
          thumbnail = `https://raw.githubusercontent.com/${owner}/${name}/${defaultBranch}/${thumbnail}`;
        }

        const project: Project = {
          slug: name,
          title: folio.title,
          description: folio.description,
          status: folio.status,
          startedAt: folio.startedAt ?? null,
          lastActiveAt,
          thumbnail,
          repoUrl: repo.html_url as string,
        };

        projects.push(project);
      })
    );

    // Sort by lastActiveAt desc
    projects.sort((a, b) => {
      const aTime = a.lastActiveAt ? Date.parse(a.lastActiveAt) : 0;
      const bTime = b.lastActiveAt ? Date.parse(b.lastActiveAt) : 0;
      return bTime - aTime;
    });

    return NextResponse.json(projects);
  } catch (err: any) {
    console.error("Error building projects list:", err);
    return NextResponse.json(
      { error: "Failed to load projects" },
      { status: 500 }
    );
  }
}
