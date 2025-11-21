import { NextRequest, NextResponse } from "next/server";

const GITHUB_USER = process.env.GITHUB_USER ?? "kidfromjupiter";
const GITHUB_TOKEN = process.env.GITHUB_ACCESS_TOKEN;

// helper: format Date → YYYY-MM-DD
function toISODate(d: Date) {
  return d.toISOString().slice(0, 10);
}

// default: last 6 months window
function getDefaultDateRange() {
  const to = new Date();
  const from = new Date();
  from.setMonth(from.getMonth() - 6);
  return {
    from: toISODate(from),
    to: toISODate(to),
  };
}

export async function GET(req: NextRequest) {
  try {
    if (!GITHUB_TOKEN) {
      return NextResponse.json(
        { error: "GITHUB_TOKEN is not set" },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") ?? "1");
    const perPage = Number(searchParams.get("perPage") ?? "25");

    // allow overriding the date range, but default to last 6 months
    const { from: defaultFrom, to: defaultTo } = getDefaultDateRange();
    const from = searchParams.get("from") ?? defaultFrom;
    const to = searchParams.get("to") ?? defaultTo;

    // this mirrors what you’re doing in Hoppscotch:
    // q=author:kidfromjupiter+committer-date:2025-06-01..2025-12-31
    const q = `author:${GITHUB_USER}+committer-date:${from}..${to}`;

    const endpoint =
      `https://api.github.com/search/commits` +
      `?q=${q}` +
      `&sort=committer-date` +
      `&order=desc` +
      `&page=${page}` +
      `&per_page=${perPage}`;

    const res = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        // commit search historically used a preview header; this works in practice:
        Accept: "application/vnd.github+json",
      },
      // cache a little bit in prod if you want
      // @ts-ignore
      next: { revalidate: 60 },
    });

    const json = await res.json();

    if (!res.ok) {
      console.error("GitHub search/commits error:", json);
      return NextResponse.json(
        { error: "Failed to fetch commits from GitHub" },
        { status: 500 }
      );
    }

    const commits =
      (json.items || []).map((item: any) => ({
        sha: item.sha,
        url: item.html_url,
        message: (item.commit?.message || "").split("\n")[0],
        repo: item.repository?.full_name,
        // prefer author date, fallback to committer date
        date: item.commit?.author?.date ?? item.commit?.committer?.date ?? null,
      })) ?? [];

    return NextResponse.json({
      commits,
      total: json.total_count ?? 0,
      page,
      perPage,
      from,
      to,
    });
  } catch (err) {
    console.error("profile-commits API error:", err);
    return NextResponse.json(
      { error: "Unexpected error in profile-commits API" },
      { status: 500 }
    );
  }
}
