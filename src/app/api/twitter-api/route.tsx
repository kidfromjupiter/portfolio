// app/api/folio-updates/route.ts
import { NextResponse } from "next/server";

// ✅ Cache this route's response for ~5 minutes.
export const revalidate = 1600; // seconds

// Your Bluesky handle (INCLUDING domain), e.g. "high-entrop.bsky.social"
const USERNAME = "entropywithintent.bsky.social";

const MAX_ITEMS = 20; // how many recent posts you want
const MAX_TEXT_LENGTH = 160; // truncate length
const FILTER_HASHTAG = "#folioupdates"; // or "" if you want ALL posts

const BSKY_AUTHOR_FEED_ENDPOINT =
  "https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed";

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

// Convert a Bluesky at:// URI into a web URL on bsky.app using your handle
function bskyPostUrlFromUri(uri: string | undefined | null): string | null {
  if (!uri || !uri.startsWith("at://")) return null;

  // e.g. "at://did:plc:abc/app.bsky.feed.post/3k4duaz5vfs2b"
  const parts = uri.split("/");
  const rkey = parts[parts.length - 1];
  if (!rkey) return null;

  // USERNAME is the handle, e.g. "you.bsky.social"
  return `https://bsky.app/profile/${USERNAME}/post/${rkey}`;
}

export async function GET() {
  try {
    // Bluesky's author feed endpoint (no auth needed for public data)
    // Docs: https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed
    const url = new URL(BSKY_AUTHOR_FEED_ENDPOINT);
    url.searchParams.set("actor", USERNAME);
    url.searchParams.set("limit", String(MAX_ITEMS));
    // Only your own posts, no replies; tweak if you want replies:
    // posts_no_replies | posts_with_replies | posts_with_media | posts_and_author_threads
    url.searchParams.set("filter", "posts_no_replies");

    const feedRes = await fetch(url.toString(), {
      // Respect the same revalidation window
      next: { revalidate },
    });

    if (!feedRes.ok) {
      console.error("Failed to fetch Bluesky feed:", await feedRes.text());
      return NextResponse.json(
        { error: "Failed to fetch feed from Bluesky API" },
        { status: 500 }
      );
    }

    const feedData = await feedRes.json();

    // Bluesky returns { feed: FeedViewPost[], cursor?: string }
    const feed = (feedData as any)?.feed ?? [];

    const tagLower = FILTER_HASHTAG.toLowerCase();

    // 1) Filter by hashtag (on the raw text)
    const filtered = feed.filter((item: any) => {
      const record = item?.post?.record;
      const text: string | undefined = record?.text;
      if (!FILTER_HASHTAG) return Boolean(text);
      if (typeof text !== "string") return false;
      return text.toLowerCase().includes(tagLower);
    });

    // 2) Map into your desired shape: { timestamp, text, link }
    const mapped = filtered
      .map((item: any) => {
        const post = item?.post;
        const record = post?.record ?? {};
        const text: string = typeof record.text === "string" ? record.text : "";
        const createdAt: string | null =
          typeof record.createdAt === "string" ? record.createdAt : null;

        // Bluesky post URI: at://did/.../app.bsky.feed.post/<rkey>
        const uri: string | null =
          typeof post?.uri === "string" ? post.uri : null;
        const link = bskyPostUrlFromUri(uri);

        if (!text && !link) return null;

        return {
          timestamp: createdAt, // ISO string, similar to X's created_at
          text: truncate(stripFolioHashtag(text), MAX_TEXT_LENGTH),
          link,
        };
      })
      .filter((x: any): x is NonNullable<typeof x> => x !== null);

    // Already "most recent first" from Bluesky.
    return NextResponse.json(mapped);
  } catch (err) {
    console.error("Unexpected error talking to Bluesky API:", err);
    return NextResponse.json(
      { error: "Unexpected error talking to Bluesky API" },
      { status: 500 }
    );
  }
}
