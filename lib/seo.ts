export const siteUrl = "https://www.gangnamhopa.com";

export function normalizeCanonicalPath(path = "/") {
  let pathname = path.trim() || "/";

  if (/^https?:\/\//i.test(pathname)) {
    try {
      pathname = new URL(pathname).pathname;
    } catch {
      pathname = "/";
    }
  }

  pathname = pathname.split(/[?#]/)[0] || "/";

  if (!pathname.startsWith("/")) {
    pathname = `/${pathname}`;
  }

  pathname = pathname.replace(/\/{2,}/g, "/");

  if (pathname.length > 1) {
    pathname = pathname.replace(/\/+$/, "");
  }

  return pathname === "/" ? "/" : pathname.toLowerCase();
}

export function canonicalUrl(path = "/") {
  const pathname = normalizeCanonicalPath(path);

  return pathname === "/" ? siteUrl : `${siteUrl}${pathname}`;
}

export function absoluteAssetUrl(sourceUrl = "/og.png") {
  if (/^https?:\/\//i.test(sourceUrl)) {
    return sourceUrl;
  }

  return `${siteUrl}${sourceUrl.startsWith("/") ? "" : "/"}${sourceUrl}`;
}
