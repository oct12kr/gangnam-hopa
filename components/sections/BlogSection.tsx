"use client";

import { FileText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchPosts } from "@/lib/wordpress-client";
import type { BlogPost as WordPressBlogPost } from "@/types/wordpress";
import ScrollReveal from "@/components/ui/ScrollReveal";

type BlogPost = {
  id: number;
  title: string;
  date: string;
  link: string;
  category: string;
  image: string;
};

type BlogResponse = {
  status: "ok" | "error";
  posts: BlogPost[];
  source?: string;
};

function toPreviewPost(post: WordPressBlogPost): BlogPost {
  return {
    id: post.id,
    title: post.title,
    date: post.date,
    link: `/blog/${post.slug}`,
    category: post.category.name,
    image: post.thumbnail,
  };
}

function formatDate(value: string) {
  if (/^\d{4}\.\d{2}\.\d{2}$/.test(value)) {
    return value;
  }

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
}

function useBlogPosts(limit: number) {
  const [data, setData] = useState<BlogResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function loadPosts() {
      try {
        setIsLoading(true);
        const payload = await fetchPosts({ perPage: limit });
        setData({
          status: payload.error ? "error" : "ok",
          posts: payload.posts.map(toPreviewPost),
        });
      } catch {
        if (!controller.signal.aborted) {
          setData({ status: "error", posts: [] });
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadPosts();
    return () => controller.abort();
  }, [limit]);

  return { data, isLoading };
}

function BlogSkeleton({ count }: { count: number }) {
  return (
    <div className="blog-grid" aria-label="블로그를 불러오는 중">
      {Array.from({ length: count }).map((_, index) => (
        <article className="glass-card blog-card skeleton-card" key={index}>
          <div className="skeleton-image" />
          <div className="skeleton-line short" />
          <div className="skeleton-line" />
          <div className="skeleton-line tiny" />
        </article>
      ))}
    </div>
  );
}

function BlogCards({ posts }: { posts: BlogPost[] }) {
  return (
    <div className={`blog-grid blog-grid-count-${Math.min(posts.length, 3)}`}>
      {posts.map((post) => (
        <Link className="glass-card blog-card" href={post.link} key={post.id}>
          <div className="blog-image-wrap">
            {post.image.startsWith("/") || post.image.startsWith("http") ? (
              <Image src={post.image} alt="" fill sizes="(min-width: 900px) 33vw, 100vw" />
            ) : (
              <div className="blog-thumb-placeholder" aria-hidden="true">
                <span>NEWS</span>
              </div>
            )}
          </div>
          <div className="blog-card-body">
            <span>{post.category}</span>
            <h3>{post.title}</h3>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
          </div>
        </Link>
      ))}
    </div>
  );
}

function BlogEmptyState({ isError = false }: { isError?: boolean }) {
  return (
    <div className="blog-empty-state compact">
      <FileText size={30} strokeWidth={1.5} aria-hidden="true" />
      <h3>{isError ? "게시글을 불러오는 중 문제가 발생했습니다." : "아직 등록된 게시글이 없습니다."}</h3>
      <p>{isError ? "잠시 후 다시 시도해주세요." : "발행된 글이 생기면 이곳에 자동으로 표시됩니다."}</p>
    </div>
  );
}

export function BlogPreview() {
  const { data, isLoading } = useBlogPosts(3);
  const posts = data?.posts ?? [];

  return (
    <ScrollReveal as="section" className="section blog-section" id="blog">
      <div className="section-heading centered">
        <span className="eyebrow">Latest News</span>
        <h2>최신 소식</h2>
        <p>운영 안내 / 이벤트 / 공지사항 / 방문 후기</p>
      </div>

      {isLoading ? <BlogSkeleton count={3} /> : posts.length > 0 ? <BlogCards posts={posts} /> : <BlogEmptyState isError={data?.status === "error"} />}

      <Link className="text-link more-link" href="/blog">
        더보기 -&gt;
      </Link>
    </ScrollReveal>
  );
}

export function BlogArchive() {
  const { data, isLoading } = useBlogPosts(9);
  const posts = data?.posts ?? [];

  return (
    <main className="blog-archive">
      <div className="archive-hero">
        <span className="eyebrow">BOSTON Blog</span>
        <h1>최신 소식</h1>
        <p>운영 안내와 공지사항을 한곳에서 확인하세요.</p>
      </div>

      {isLoading ? <BlogSkeleton count={6} /> : posts.length > 0 ? <BlogCards posts={posts} /> : <BlogEmptyState isError={data?.status === "error"} />}
    </main>
  );
}
