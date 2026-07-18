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

const WP_API_URL_KEYS = ["WP_API_URL", "WP_URL"];
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
