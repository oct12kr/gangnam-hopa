import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/sections/Footer";
import SiteHeader from "@/components/ui/SiteHeader";
import { businessName, siteUrl } from "@/lib/constants";
import { absoluteAssetUrl, buildMetaDescription, buildMetaTitle, canonicalUrl, defaultSeo } from "@/lib/seo";
import { getBlogPostBySlug } from "@/lib/wordpress-server";

export const dynamic = "force-dynamic";

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function formatDate(value: string | null) {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(value));
}

async function findPost(slug: string) {
  return getBlogPostBySlug(slug).catch(() => null);
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const post = await findPost(slug);
  const pageUrl = canonicalUrl(`/blog/${post?.slug ?? slug}`);
  const title = buildMetaTitle(post?.title ?? "강남보스턴 블로그 글");
  const description = buildMetaDescription({
    description: post?.excerpt,
    content: post?.content,
    fallback: post ? `${post.title} 본문을 확인해 보세요.` : defaultSeo.fallbackDescription,
  });
  const imageUrl = absoluteAssetUrl(post?.thumbnail, defaultSeo.blogImage);

  return {
    title,
    description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      type: "article",
      locale: defaultSeo.locale,
      url: pageUrl,
      siteName: defaultSeo.siteName,
      title,
      description,
      publishedTime: post?.date ?? undefined,
      modifiedTime: post?.modified ?? undefined,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post?.thumbnailAlt || post?.title || `${businessName} 블로그 대표 이미지`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const post = await findPost(slug);

  if (!post) {
    notFound();
  }

  const formattedDate = formatDate(post.date);
  const pageUrl = canonicalUrl(`/blog/${post.slug}`);
  const pageDescription = buildMetaDescription({
    description: post.excerpt,
    content: post.content,
    fallback: `${post.title} 본문을 확인해 보세요.`,
  });
  const imageUrl = absoluteAssetUrl(post.thumbnail, defaultSeo.blogImage);
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${pageUrl}#blogposting`,
    url: pageUrl,
    headline: post.title,
    description: pageDescription,
    datePublished: post.date ?? post.modified ?? undefined,
    dateModified: post.modified ?? post.date ?? undefined,
    author: {
      "@type": "Person",
      name: post.author || businessName,
    },
    publisher: {
      "@type": "Organization",
      name: businessName,
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: absoluteAssetUrl("/favicon.svg"),
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
    },
    image: [imageUrl],
    inLanguage: "ko-KR",
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: businessName,
        item: canonicalUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "블로그",
        item: canonicalUrl("/blog"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: pageUrl,
      },
    ],
  };

  return (
    <>
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />
      <SiteHeader mode="blog" />
      <main className="blog-detail-page">
        <article className="blog-detail-shell">
          <Link className="blog-detail-back" href="/blog">
            Blog
          </Link>

          <header className="blog-detail-header">
            <div className="blog-detail-meta">
              {formattedDate ? <time dateTime={post.date ?? undefined}>{formattedDate}</time> : null}
              {post.categories.map((category) => (
                <span key={`${category.slug}-${category.name}`}>{category.name}</span>
              ))}
            </div>
            <h1>{post.title}</h1>
            {post.excerpt ? <p>{post.excerpt}</p> : null}
          </header>

          {post.thumbnail ? (
            <div className="blog-detail-image">
              <Image src={post.thumbnail} alt="" fill sizes="(min-width: 1024px) 960px, 100vw" priority />
            </div>
          ) : null}

          <div className="blog-detail-content" dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>
      </main>
      <Footer />
    </>
  );
}

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
