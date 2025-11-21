// app/api/projects/route.ts
import { NextResponse } from "next/server";
// @ts-ignore
import yaml from "js-yaml";

export const revalidate = 3600; // cache for 1 hour

const GITHUB_API = "https://api.github.com";
const { GITHUB_ACCESS_TOKEN } = process.env;

type Status = "active" | "abandoned" | "finished";

type FolioYaml = {
  title: string;
  description: string;
  status: Status;
  startedAt?: string; // now optional / ignored in favour of first commit
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
  const res = await fetch(`${GITHUB_API}/user/repos?per_page=100`, {
    headers: ghHeaders(),
  });

  if (!res.ok) {
    throw new Error(`Failed to list repos: ${res.status} ${await res.text()}`);
  }

  return (await res.json()) as any[];
}

// ─────────────────────────────────────────────────────────────
// Get first commit date on default branch
// ─────────────────────────────────────────────────────────────
async function getFirstCommitDate(
  owner: string,
  repo: string,
  defaultBranch: string
): Promise<string | null> {
  const baseUrl = `${GITHUB_API}/repos/${owner}/${repo}/commits?per_page=1&sha=${encodeURIComponent(
    defaultBranch
  )}`;

  // First request: get the most recent commit + Link header
  const firstRes = await fetch(baseUrl, { headers: ghHeaders() });

  if (firstRes.status === 403) {
    console.warn(
      `Skipping first-commit lookup for ${owner}/${repo}: 403 (forbidden)`
    );
    return null;
  }

  if (firstRes.status === 404) {
    // e.g. empty repo
    console.warn(`No commits found for ${owner}/${repo} (404)`);
    return null;
  }

  if (!firstRes.ok) {
    console.warn(
      `Failed to list commits for ${owner}/${repo}: ${
        firstRes.status
      } ${await firstRes.text()}`
    );
    return null;
  }

  const firstCommits = (await firstRes.json()) as any[];
  if (!Array.isArray(firstCommits) || firstCommits.length === 0) {
    // No commits
    return null;
  }

  const link = firstRes.headers.get("link");

  // If there's no Link header, repo only has 1 page of commits,
  // so the commit we just got is *also* the first and last.
  if (!link || !link.includes('rel="last"')) {
    const c = firstCommits[0];
    const date = c.commit?.author?.date || c.commit?.committer?.date || null;
    return date;
  }

  // Parse the "last" page number from the Link header
  const match = link.match(/&page=(\d+)>;\s*rel="last"/);
  const lastPage = match ? parseInt(match[1], 10) : null;

  if (!lastPage || Number.isNaN(lastPage)) {
    // Fallback: use the commit we already got
    const c = firstCommits[0];
    const date = c.commit?.author?.date || c.commit?.committer?.date || null;
    return date;
  }

  // Second request: go to the last page to get the *earliest* commit
  const lastRes = await fetch(`${baseUrl}&page=${lastPage}`, {
    headers: ghHeaders(),
  });

  if (!lastRes.ok) {
    console.warn(
      `Failed to fetch last page of commits for ${owner}/${repo}: ${
        lastRes.status
      } ${await lastRes.text()}`
    );
    // Fallback to the first response value
    const c = firstCommits[0];
    const date = c.commit?.author?.date || c.commit?.committer?.date || null;
    return date;
  }

  const lastCommits = (await lastRes.json()) as any[];
  if (!Array.isArray(lastCommits) || lastCommits.length === 0) {
    const c = firstCommits[0];
    const date = c.commit?.author?.date || c.commit?.committer?.date || null;
    return date;
  }

  const earliest = lastCommits[0];
  const earliestDate =
    earliest.commit?.author?.date || earliest.commit?.committer?.date || null;

  return earliestDate;
}

// ─────────────────────────────────────────────────────────────
// Get folio.yml for a repo (ignore 403/404)
// ─────────────────────────────────────────────────────────────
async function getFolioYaml(owner: string, repo: string) {
  const path = "folio.yml";

  const res = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`,
    { headers: ghHeaders() }
  );

  if (res.status === 404) {
    // no folio.yml in this repo
    return null;
  }

  if (res.status === 403) {
    // forbidden → skip this repo completely
    console.warn(
      `Skipping ${owner}/${repo}: folio.yml is forbidden (403). Ignoring repo for portfolio.`
    );
    return null;
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
    const visibleRepos = repos.filter((r) => !r.archived);

    const projects: Project[] = [];

    await Promise.all(
      visibleRepos.map(async (repo) => {
        const owner = repo.owner.login as string;
        const name = repo.name as string;

        const folio = await getFolioYaml(owner, name);
        if (!folio) return; // no file / 403 / whatever

        if (!folio.title || !folio.description || !folio.status) return;

        const defaultBranch = repo.default_branch || "main";

        // 🔹 get first commit date for startedAt
        const firstCommitDate =
          (await getFirstCommitDate(owner, name, defaultBranch)) ||
          repo.created_at ||
          null;

        // last active from repo metadata
        const lastActiveAt = repo.pushed_at ?? null;

        // resolve thumbnail
        let thumbnail: string | null = folio.thumbnail ?? null;
        if (thumbnail && !thumbnail.startsWith("http")) {
          const branch = defaultBranch;
          thumbnail = `https://raw.githubusercontent.com/${owner}/${name}/${branch}/${thumbnail}`;
        }

        projects.push({
          slug: name,
          title: folio.title,
          description: folio.description,
          status: folio.status,
          startedAt: firstCommitDate,
          lastActiveAt,
          thumbnail,
          repoUrl: repo.html_url as string,
        });
      })
    );

    // Sort by lastActiveAt desc
    projects.sort((a, b) => {
      const aTime = a.lastActiveAt ? Date.parse(a.lastActiveAt) : 0;
      const bTime = b.lastActiveAt ? Date.parse(b.lastActiveAt) : 0;
      return bTime - aTime;
    });

    return NextResponse.json(projects);
  } catch (err) {
    console.error("Error building projects list:", err);
    return NextResponse.json(
      { error: "Failed to load projects" },
      { status: 500 }
    );
  }
}
