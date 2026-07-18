import type { BlogPost, Category } from "@/types/wordpress";

type FetchPostsParams = {
  page?: number;
  perPage?: number;
  category?: string;
};

type WordPressRendered = {
  rendered?: string;
};

type WordPressPost = {
  id?: number;
  slug?: string;
  date?: string;
  title?: WordPressRendered;
  excerpt?: WordPressRendered;
  _embedded?: {
    "wp:featuredmedia"?: Array<{ source_url?: string }>;
    "wp:term"?: Array<Array<{ slug?: string; name?: string; taxonomy?: string }>>;
  };
};

type WordPressCategory = {
  id?: number;
  slug?: string;
  name?: string;
  count?: number;
};

function textFromHtml(value = "") {
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&#8211;/g, "-")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&quot;/g, '"')
    .trim();
}

function formatDate(value?: string) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}

function normalizePost(post: WordPressPost, index: number): BlogPost {
  const terms = post._embedded?.["wp:term"]?.flat() ?? [];
  const category = terms.find((term) => term.taxonomy === "category");
  const thumbnail = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;

  return {
    id: post.id ?? index,
    slug: post.slug ?? `post-${post.id ?? index}`,
    title: textFromHtml(post.title?.rendered) || "강남보스턴 소식",
    excerpt: textFromHtml(post.excerpt?.rendered),
    date: formatDate(post.date),
    thumbnail: thumbnail || "gradient",
    category: {
      slug: category?.slug ?? "",
      name: textFromHtml(category?.name) || "미분류",
    },
  };
}

function normalizeCategory(category: WordPressCategory): Category {
  return {
    slug: category.slug ?? "",
    name: textFromHtml(category.name) || "카테고리",
    count: category.count ?? 0,
  };
}

export async function fetchPosts(params: FetchPostsParams = {}): Promise<{
  posts: BlogPost[];
  totalPages: number;
  total: number;
  error?: string;
}> {
  const query = new URLSearchParams({
    page: String(params.page ?? 1),
    perPage: String(params.perPage ?? 12),
  });

  if (params.category) {
    query.set("category", params.category);
  }

  try {
    const res = await fetch(`/api/blog/posts?${query}`, {
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      return { posts: [], totalPages: 0, total: 0, error: "WordPress posts request failed" };
    }

    const payload = (await res.json()) as { posts?: WordPressPost[]; totalPages?: number; total?: number };
    const posts = Array.isArray(payload.posts) ? payload.posts.map(normalizePost) : [];

    return {
      posts,
      totalPages: Number(payload.totalPages ?? 0),
      total: Number(payload.total ?? posts.length),
    };
  } catch {
    return { posts: [], totalPages: 0, total: 0, error: "WordPress posts request failed" };
  }
}

export async function fetchCategories(): Promise<{ categories: Category[]; error?: string }> {
  try {
    const res = await fetch("/api/blog/categories", {
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      return { categories: [], error: "WordPress categories request failed" };
    }

    const payload = (await res.json()) as { categories?: WordPressCategory[] };
    return {
      categories: Array.isArray(payload.categories) ? payload.categories.map(normalizeCategory).filter((category) => category.slug) : [],
    };
  } catch {
    return { categories: [], error: "WordPress categories request failed" };
  }
}

export async function fetchPostBySlug(slug: string): Promise<{ post: BlogPost | null; error?: string }> {
  try {
    const res = await fetch(`/api/blog/posts/${encodeURIComponent(slug)}`, {
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      return { post: null, error: "WordPress post request failed" };
    }

    const payload = (await res.json()) as { post?: WordPressPost | null };
    return { post: payload.post ? normalizePost(payload.post, 0) : null };
  } catch {
    return { post: null, error: "WordPress post request failed" };
  }
}
