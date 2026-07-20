import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/sections/Footer";
import SiteHeader from "@/components/ui/SiteHeader";
import { absoluteAssetUrl, canonicalUrl } from "@/lib/seo";
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
  const title = post ? `${post.title} | BOSTON Blog` : "BOSTON Blog";
  const description = post?.excerpt || "강남보스턴 블로그 글입니다.";
  const imageUrl = absoluteAssetUrl(post?.thumbnail ?? "/og.png");

  return {
    title,
    description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      type: "article",
      url: pageUrl,
      title,
      description,
      images: [imageUrl],
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

  return (
    <>
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
