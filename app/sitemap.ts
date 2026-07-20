import type { MetadataRoute } from "next";
import { canonicalUrl } from "@/lib/seo";
import { getBlogPostSlugs } from "@/lib/wordpress-server";

export const dynamic = "force-dynamic";

function safeLastModified(value?: string | null) {
  const date = value ? new Date(value) : new Date();

  return Number.isNaN(date.getTime()) ? new Date() : date;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogPosts = await getBlogPostSlugs().catch(() => []);
  const seenUrls = new Set<string>();

  const blogEntries = blogPosts.flatMap((post) => {
    const url = canonicalUrl(`/blog/${post.slug}`);

    if (seenUrls.has(url)) {
      return [];
    }

    seenUrls.add(url);

    return [
      {
        url,
        lastModified: safeLastModified(post.modified),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      },
    ];
  });

  return [
    {
      url: canonicalUrl("/"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: canonicalUrl("/blog"),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    ...blogEntries,
  ];
}
