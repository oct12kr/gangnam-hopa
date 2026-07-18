import { NextResponse } from "next/server";

export const runtime = "nodejs";

type WordPressPost = {
  id?: number;
  date?: string;
  link?: string;
  title?: { rendered?: string };
  _embedded?: {
    "wp:featuredmedia"?: Array<{ source_url?: string }>;
    "wp:term"?: Array<Array<{ name?: string; taxonomy?: string }>>;
  };
};

const defaultWordPressApi = "https://gangnamboston.net/wp-json/wp/v2/posts";

const fallbackImages = [
  "/images/lounge-placeholder.png",
  "/images/lounge-placeholder.png",
  "/images/lounge-placeholder.png",
];

const fallbackPosts = [
  {
    id: 9001,
    title: "365일 예약 문의 안내",
    date: "2026-07-18",
    link: "/#reservation",
    category: "운영 안내",
    image: fallbackImages[0],
  },
  {
    id: 9002,
    title: "프리미엄 룸 이용 가이드",
    date: "2026-07-18",
    link: "/#system",
    category: "공지사항",
    image: fallbackImages[1],
  },
  {
    id: 9003,
    title: "방문 전 예약 상담 안내",
    date: "2026-07-18",
    link: "/#reservation",
    category: "예약",
    image: fallbackImages[2],
  },
];

function safeImageUrl(value: string | undefined, index: number) {
  if (!value) {
    return fallbackImages[index % fallbackImages.length];
  }

  try {
    const url = new URL(value);
    const allowedHosts = new Set(["gangnamboston.net", "public-api.wordpress.com"]);
    return allowedHosts.has(url.hostname) ? value : fallbackImages[index % fallbackImages.length];
  } catch {
    return fallbackImages[index % fallbackImages.length];
  }
}

function textFromHtml(value = "") {
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&#8211;/g, "-")
    .replace(/&#8217;/g, "'")
    .replace(/&quot;/g, '"')
    .trim();
}

function normalizePost(post: WordPressPost, index: number) {
  const terms = post._embedded?.["wp:term"]?.flat() ?? [];
  const category = terms.find((term) => term.taxonomy === "category")?.name ?? "News";
  const image = safeImageUrl(post._embedded?.["wp:featuredmedia"]?.[0]?.source_url, index);

  return {
    id: post.id ?? index,
    title: textFromHtml(post.title?.rendered) || "강남보스턴 소식",
    date: post.date ?? new Date().toISOString(),
    link: post.link ?? "/blog",
    category: textFromHtml(category),
    image,
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(Math.max(Number(searchParams.get("limit")) || 3, 1), 12);
  const endpoint = process.env.WORDPRESS_API_URL ?? process.env.NEXT_PUBLIC_WORDPRESS_API_URL ?? defaultWordPressApi;

  try {
    const wordpressUrl = new URL(endpoint);
    wordpressUrl.searchParams.set("_embed", "1");
    wordpressUrl.searchParams.set("per_page", String(limit));
    wordpressUrl.searchParams.set("orderby", "date");
    wordpressUrl.searchParams.set("order", "desc");

    const response = await fetch(wordpressUrl.toString(), {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`WordPress responded with ${response.status}`);
    }

    const posts = (await response.json()) as WordPressPost[];

    if (!Array.isArray(posts) || posts.length === 0) {
      throw new Error("WordPress returned no posts");
    }

    return NextResponse.json({
      status: "ok",
      source: wordpressUrl.origin,
      posts: posts.slice(0, limit).map(normalizePost),
    });
  } catch {
    return NextResponse.json({
      status: "fallback",
      source: endpoint,
      posts: Array.from({ length: limit }, (_, index) => fallbackPosts[index % fallbackPosts.length]).map((post, index) => ({
        ...post,
        id: post.id + index,
      })),
    });
  }
}
