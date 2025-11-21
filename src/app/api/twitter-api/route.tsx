// app/api/folio-updates/route.ts
import { NextResponse } from "next/server";

// ✅ Cache this route's response for 5 minutes.
// During that time, Next.js will serve the cached JSON
// and *won't* call the X API again.
export const revalidate = 300; // seconds

const USERNAME = "high_entrop"; // ← your current handle
const MAX_ITEMS = 20; // how many recent posts you want
const MAX_TEXT_LENGTH = 160; // truncate length
const FILTER_HASHTAG = "#folioupdates"; // or "" if you want ALL posts

function truncate(text: string, max: number) {
  return text.length > max ? text.slice(0, max - 1) + "…" : text;
}

// remove ONLY your folio hashtag from the text (case-insensitive)
function stripFolioHashtag(text: string): string {
  if (!FILTER_HASHTAG) return text;

  const tag = FILTER_HASHTAG.replace("#", ""); // "folioupdates"
  const regex = new RegExp(`#${tag}\\b`, "gi"); // matches "#folioupdates" in any case

  // remove tag + collapse extra spaces
  return text
    .replace(regex, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export async function GET() {
  const bearerToken = process.env.X_BEARER_TOKEN;
  if (!bearerToken) {
    return NextResponse.json(
      { error: "X_BEARER_TOKEN is not set on the server" },
      { status: 500 }
    );
  }

  try {
    // 1) Get user ID from username
    const userRes = await fetch(
      `https://api.x.com/2/users/by/username/${USERNAME}`,
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      }
    );

    if (!userRes.ok) {
      console.error("Failed to fetch user:", await userRes.text());
      return NextResponse.json(
        { error: "Failed to fetch user from X API" },
        { status: 500 }
      );
    }

    const userData = await userRes.json();
    const userId = userData?.data?.id;
    if (!userId) {
      return NextResponse.json(
        { error: "User ID not found in X API response" },
        { status: 500 }
      );
    }

    // 2) Get most recent tweets for that user
    const tweetsRes = await fetch(
      `https://api.x.com/2/users/${userId}/tweets?` +
        new URLSearchParams({
          max_results: String(MAX_ITEMS), // max 100
          "tweet.fields": "created_at",
          // you can add more fields if needed
        }),
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      }
    );

    if (!tweetsRes.ok) {
      console.error("Failed to fetch tweets:", await tweetsRes.text());
      return NextResponse.json(
        { error: "Failed to fetch tweets from X API" },
        { status: 500 }
      );
    }

    const tweetsData = await tweetsRes.json();
    const tweets = tweetsData?.data ?? [];

    // 3) Optional: keep only posts that contain your hashtag
    //    We filter on the *raw* tweet text so the hashtag is still present.
    let filtered = tweets;
    if (FILTER_HASHTAG) {
      const tagLower = FILTER_HASHTAG.toLowerCase();
      filtered = tweets.filter((t: any) =>
        (t.text as string).toLowerCase().includes(tagLower)
      );
    }

    // 4) Map to your desired shape, stripping the hashtag and truncating
    const mapped = filtered.map((t: any) => ({
      timestamp: t.created_at,
      text: truncate(stripFolioHashtag(t.text), MAX_TEXT_LENGTH),
      // this form works even if you change your handle later:
      // link: `https://x.com/i/web/status/${t.id}`,
      link: `https://x.com/${USERNAME}/status/${t.id}`,
    }));

    // Already in "most recent first" order from X
    return NextResponse.json(mapped);
  } catch (err) {
    console.error("Unexpected error talking to X API:", err);
    return NextResponse.json(
      { error: "Unexpected error talking to X API" },
      { status: 500 }
    );
  }
}
