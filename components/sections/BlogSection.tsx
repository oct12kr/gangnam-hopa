"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { loungeImage } from "./content";

type BlogPost = {
  id: number;
  title: string;
  date: string;
  link: string;
  category: string;
  image: string;
};

type BlogResponse = {
  status: "ok" | "fallback";
  posts: BlogPost[];
  source?: string;
};

const clientFallbackPosts: BlogPost[] = [
  {
    id: 9001,
    title: "365일 예약 문의 안내",
    date: "2026-07-18",
    link: "/#reservation",
    category: "운영 안내",
    image: loungeImage,
  },
  {
    id: 9002,
    title: "프리미엄 룸 이용 가이드",
    date: "2026-07-18",
    link: "/#system",
    category: "공지사항",
    image: loungeImage,
  },
  {
    id: 9003,
    title: "방문 전 예약 상담 안내",
    date: "2026-07-18",
    link: "/#reservation",
    category: "예약",
    image: loungeImage,
  },
];

function formatDate(value: string) {
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
        const response = await fetch(`/api/posts?limit=${limit}`, {
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });

        if (!response.ok) {
          throw new Error("Blog API request failed");
        }

        const payload = (await response.json()) as BlogResponse;
        setData(payload);
      } catch {
        if (!controller.signal.aborted) {
          setData({ status: "fallback", posts: clientFallbackPosts.slice(0, limit) });
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
    <div className="blog-grid">
      {posts.map((post) => (
        <a className="glass-card blog-card" href={post.link} key={post.id}>
          <div className="blog-image-wrap">
            <Image src={post.image} alt="" fill sizes="(min-width: 900px) 33vw, 100vw" />
          </div>
          <div className="blog-card-body">
            <span>{post.category}</span>
            <h3>{post.title}</h3>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
          </div>
        </a>
      ))}
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

      {isLoading ? <BlogSkeleton count={3} /> : <BlogCards posts={posts} />}

      {data?.status === "fallback" && !isLoading ? (
        <p className="blog-status">WordPress API 연결 전까지 기본 안내를 표시 중입니다.</p>
      ) : null}

      <a className="text-link more-link" href="/blog">
        더보기 -&gt;
      </a>
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

      {isLoading ? <BlogSkeleton count={6} /> : <BlogCards posts={posts} />}

      {data?.status === "fallback" && !isLoading ? (
        <p className="blog-status archive-status">WordPress API 연결 전까지 기본 안내를 표시 중입니다.</p>
      ) : null}
    </main>
  );
}
