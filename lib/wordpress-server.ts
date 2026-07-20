import { Buffer } from "node:buffer";

export class WordPressConfigError extends Error {
  missingKeys: string[];

  constructor(missingKeys: string[]) {
    super("WordPress API environment variables are missing");
    this.name = "WordPressConfigError";
    this.missingKeys = missingKeys;
  }
}

type FetchWordPressResult<T> = {
  data: T;
  total: number;
  totalPages: number;
};

type WordPressPostSlug = {
  slug?: string;
  modified?: string | null;
};

type WordPressRendered = {
  rendered?: string;
};

type WordPressPublicTerm = {
  slug?: string;
  name?: string;
  taxonomy?: string;
};

type WordPressPublicMedia = {
  source_url?: string;
  alt_text?: string;
};

type WordPressPublicAuthor = {
  name?: string;
};

type WordPressPublicPost = {
  id?: number;
  slug?: string;
  date?: string | null;
  modified?: string | null;
  title?: WordPressRendered;
  excerpt?: WordPressRendered;
  content?: WordPressRendered;
  _embedded?: {
    author?: WordPressPublicAuthor[];
    "wp:featuredmedia"?: WordPressPublicMedia[];
    "wp:term"?: WordPressPublicTerm[][];
  };
};

const WP_API_URL_KEYS = ["WP_API_URL", "WP_URL", "NEXT_PUBLIC_WORDPRESS_API_URL"];
const WP_USERNAME_KEYS = ["WP_APP_USERNAME", "WORDPRESS_USERNAME", "WP_USERNAME"];
const WP_PASSWORD_KEYS = ["WP_APP_PASSWORD", "WORDPRESS_APPLICATION_PASSWORD"];
const MAX_ERROR_BODY_LOG_LENGTH = 2000;

function getFirstEnv(keys: string[]) {
  const key = keys.find((name) => Boolean(process.env[name]));
  return key ? { key, value: process.env[key] } : null;
}

function getApiBaseUrl(value: string) {
  const cleanUrl = value.replace(/\/+$/, "");
  return cleanUrl.includes("/wp-json/wp/v2") ? cleanUrl : `${cleanUrl}/wp-json/wp/v2`;
}

function clampPerPage(value: number) {
  return Math.max(1, Math.min(Math.floor(value), 100));
}

function textFromHtml(value = "") {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCharCode(Number(code)))
    .replace(/&#x([a-f0-9]+);/gi, (_, code: string) => String.fromCharCode(parseInt(code, 16)))
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&hellip;/g, "...")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

export function getWordPressConfig() {
  const apiUrl = getFirstEnv(WP_API_URL_KEYS);
  const username = getFirstEnv(WP_USERNAME_KEYS);
  const password = getFirstEnv(WP_PASSWORD_KEYS);
  const missingKeys = [
    !apiUrl?.value ? WP_API_URL_KEYS[0] : null,
    !username?.value ? WP_USERNAME_KEYS[0] : null,
    !password?.value ? WP_PASSWORD_KEYS[0] : null,
  ].filter(Boolean) as string[];

  if (missingKeys.length > 0 || !apiUrl?.value || !username?.value || !password?.value) {
    console.error("[WP API] 환경변수 누락:", missingKeys.join(", "));
    throw new WordPressConfigError(missingKeys);
  }

  return {
    apiBaseUrl: getApiBaseUrl(apiUrl.value),
    apiUrlKey: apiUrl.key,
    password: password.value,
    passwordKey: password.key,
    username: username.value,
    usernameKey: username.key,
  };
}

export function getAuthHeader() {
  const { username, password } = getWordPressConfig();
  const token = Buffer.from(`${username}:${password}`).toString("base64");
  return `Basic ${token}`;
}

export async function fetchWordPressJson<T>(
  endpoint: string,
  params: Record<string, string | number | boolean | undefined> = {},
): Promise<FetchWordPressResult<T>> {
  const { apiBaseUrl } = getWordPressConfig();
  const url = new URL(`${apiBaseUrl}/${endpoint.replace(/^\/+/, "")}`);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  console.log("[WP API] 요청 URL:", url.toString());

  let response: Response;
  try {
    response = await fetch(url.toString(), {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        Authorization: getAuthHeader(),
      },
    });
  } catch (error) {
    console.error("[WP API] fetch 자체 실패:", error);
    throw error;
  }

  console.log("[WP API] 응답 상태:", response.status, response.statusText);

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("[WP API] 에러 응답 본문:", errorBody.slice(0, MAX_ERROR_BODY_LOG_LENGTH));
    throw new Error(`WordPress API responded with ${response.status}`);
  }

  return {
    data: (await response.json()) as T,
    total: Number(response.headers.get("X-WP-Total") ?? "0"),
    totalPages: Number(response.headers.get("X-WP-TotalPages") ?? "1"),
  };
}

async function fetchPublicWordPressJson<T>(
  endpoint: string,
  params: Record<string, string | number | boolean | undefined> = {},
): Promise<FetchWordPressResult<T>> {
  const apiUrl = getFirstEnv(WP_API_URL_KEYS);

  if (!apiUrl?.value) {
    throw new WordPressConfigError([WP_API_URL_KEYS[0]]);
  }

  const url = new URL(`${getApiBaseUrl(apiUrl.value)}/${endpoint.replace(/^\/+/, "")}`);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  const response = await fetch(url.toString(), {
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`WordPress API responded with ${response.status}`);
  }

  return {
    data: (await response.json()) as T,
    total: Number(response.headers.get("X-WP-Total") ?? "0"),
    totalPages: Number(response.headers.get("X-WP-TotalPages") ?? "1"),
  };
}

export async function getBlogPostSlugs(first = 50) {
  const result = await fetchPublicWordPressJson<WordPressPostSlug[]>("posts", {
    _fields: "slug,modified",
    order: "desc",
    orderby: "date",
    per_page: clampPerPage(first),
  });

  return (Array.isArray(result.data) ? result.data : [])
    .filter((post): post is { slug: string; modified?: string | null } => Boolean(post.slug))
    .map((post) => ({
      slug: post.slug,
      modified: post.modified ?? null,
    }));
}

export async function getBlogPostBySlug(slug: string) {
  const result = await fetchPublicWordPressJson<WordPressPublicPost[]>("posts", {
    _embed: true,
    slug,
    per_page: 1,
  });
  const post = Array.isArray(result.data) ? result.data[0] : null;

  if (!post?.slug) {
    return null;
  }

  const terms = post._embedded?.["wp:term"]?.flat() ?? [];
  const categories = terms
    .filter((term) => !term.taxonomy || term.taxonomy === "category")
    .map((term) => ({
      slug: term.slug ?? "",
      name: textFromHtml(term.name),
    }))
    .filter((term) => term.slug || term.name);

  return {
    id: post.id ?? 0,
    slug: post.slug,
    title: textFromHtml(post.title?.rendered) || "Blog post",
    excerpt: textFromHtml(post.excerpt?.rendered),
    content: post.content?.rendered ?? "",
    date: post.date ?? null,
    modified: post.modified ?? null,
    thumbnail: post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null,
    thumbnailAlt: textFromHtml(post._embedded?.["wp:featuredmedia"]?.[0]?.alt_text),
    author: textFromHtml(post._embedded?.author?.[0]?.name) || "강남보스턴",
    categories,
  };
}

export function getWordPressErrorPayload(error: unknown) {
  if (error instanceof WordPressConfigError) {
    return {
      body: {
        error: "WordPress API 환경변수가 설정되지 않았습니다.",
        missingKeys: error.missingKeys,
      },
      status: 500,
    };
  }

  console.error("WordPress API 연동 실패:", error);
  return {
    body: { error: "WordPress 연동 실패", posts: [], categories: [], totalPages: 0, total: 0 },
    status: 502,
  };
}

export async function resolveCategoryId(category: string) {
  if (/^\d+$/.test(category)) {
    return category;
  }

  const result = await fetchWordPressJson<Array<{ id?: number }>>("categories", {
    slug: category,
    per_page: 1,
  });

  return result.data[0]?.id ? String(result.data[0].id) : "";
}
