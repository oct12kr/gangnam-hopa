"use client";

import { ChevronLeft, ChevronRight, LayoutGrid, List } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { categories, mockGetPosts, mockPosts } from "@/lib/mock-posts";
import { getPosts } from "@/lib/wordpress";
import type { BlogPost } from "@/types/wordpress";

type SortOrder = "newest" | "oldest";
type ViewMode = "grid" | "list";

const perPage = 12;
const initialCategory = categories[0]?.slug ?? "";
const initialPostResult = mockGetPosts({ page: 1, perPage, category: initialCategory });

function dateNumber(date: string) {
  return Number(date.replace(/\./g, ""));
}

function sortPosts(posts: BlogPost[], sortOrder: SortOrder) {
  return [...posts].sort((a, b) => {
    const diff = dateNumber(b.date) - dateNumber(a.date);
    return sortOrder === "newest" ? diff : -diff;
  });
}

function BlogHeroDivider() {
  return (
    <div className="blog-hero-divider" aria-hidden="true">
      <span className="blog-hero-dot" />
      <span className="blog-hero-line" />
      <span className="blog-hero-diamond" />
      <span className="blog-hero-line" />
      <span className="blog-hero-dot" />
    </div>
  );
}

function BlogThumbnail({ post, size = "large" }: { post: BlogPost; size?: "large" | "small" }) {
  const hasImage = post.thumbnail.startsWith("/") || post.thumbnail.startsWith("http");

  return (
    <div className={`blog-thumb blog-thumb-${size}`}>
      {hasImage ? <Image src={post.thumbnail} alt="" fill sizes={size === "small" ? "64px" : "(min-width: 1024px) 18vw, 100vw"} /> : null}
      {!hasImage ? (
        <div className="blog-thumb-placeholder" aria-hidden="true">
          <span>{String(post.id).padStart(2, "0")}</span>
        </div>
      ) : null}
    </div>
  );
}

export default function BlogIndexPage() {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [posts, setPosts] = useState<BlogPost[]>(initialPostResult.posts);
  const [total, setTotal] = useState(initialPostResult.total);
  const [totalPages, setTotalPages] = useState(initialPostResult.totalPages);

  useEffect(() => {
    let isMounted = true;

    getPosts({ page: currentPage, perPage, category: selectedCategory }).then((result) => {
      if (!isMounted) {
        return;
      }

      setPosts(result.posts);
      setTotal(result.total);
      setTotalPages(result.totalPages);
    });

    return () => {
      isMounted = false;
    };
  }, [currentPage, selectedCategory]);

  const selectedCategoryData = categories.find((category) => category.slug === selectedCategory) ?? categories[0];
  const sortedPosts = useMemo(() => sortPosts(posts, sortOrder), [posts, sortOrder]);
  const recentPosts = useMemo(() => sortPosts(mockPosts, "newest").slice(0, 3), []);
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  const selectCategory = (slug: string) => {
    setSelectedCategory(slug);
    setCurrentPage(1);
  };

  return (
    <main className="blog-index-page">
      <section className="blog-page-hero" aria-label="강남보스턴 블로그">
        <Image className="blog-page-hero-bg" src="/images/888.png" alt="" fill priority sizes="100vw" />
        <div className="blog-page-hero-wash" aria-hidden="true" />
        <motion.div
          className="blog-page-hero-inner"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span>BLOG</span>
          <h1>강남보스턴의 이야기</h1>
          <p>프리미엄 서비스와 다양한 소식을 전해드립니다.</p>
          <BlogHeroDivider />
        </motion.div>
      </section>

      <section className="blog-content-shell" aria-label="블로그 글 목록">
        <div className="blog-content-panel">
          <button
            className="blog-sidebar-toggle"
            type="button"
            aria-expanded={isSidebarOpen}
            onClick={() => setIsSidebarOpen((value) => !value)}
          >
            CATEGORY / RECENT POSTS
          </button>

          <aside className={`blog-sidebar ${isSidebarOpen ? "is-open" : ""}`}>
            <div className="sidebar-box">
              <h2>CATEGORY</h2>
              <div className="blog-category-list">
                {categories.map((category) => (
                  <button
                    className={category.slug === selectedCategory ? "blog-category-item is-active" : "blog-category-item"}
                    type="button"
                    key={category.slug}
                    onClick={() => selectCategory(category.slug)}
                  >
                    <span>{category.name}</span>
                    <em>({category.count})</em>
                  </button>
                ))}
              </div>

              <div className="blog-category-summary">
                <span>⊙ 현재 선택된 카테고리</span>
                <strong>
                  {selectedCategoryData.name} ({selectedCategoryData.slug})
                </strong>
                <p>총 {selectedCategoryData.count}개의 글이 있습니다.</p>
              </div>
            </div>

            <div className="sidebar-box">
              <h2>RECENT POSTS</h2>
              <div className="recent-post-list">
                {recentPosts.map((post) => (
                  <Link className="recent-post-item" href={`/blog/${post.slug}`} key={post.id}>
                    <BlogThumbnail post={post} size="small" />
                    <span>
                      <strong>{post.title}</strong>
                      <time dateTime={post.date}>{post.date}</time>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          <div className="blog-list-area">
            <div className="blog-list-toolbar">
              <p>총 {total}개의 글</p>
              <div className="blog-list-controls">
                <select value={sortOrder} aria-label="정렬" onChange={(event) => setSortOrder(event.target.value as SortOrder)}>
                  <option value="newest">최신순</option>
                  <option value="oldest">오래된순</option>
                </select>
                <button
                  className={viewMode === "grid" ? "blog-view-btn is-active" : "blog-view-btn"}
                  type="button"
                  aria-label="그리드 보기"
                  aria-pressed={viewMode === "grid"}
                  onClick={() => setViewMode("grid")}
                >
                  <LayoutGrid size={17} strokeWidth={1.8} />
                </button>
                <button
                  className={viewMode === "list" ? "blog-view-btn is-active" : "blog-view-btn"}
                  type="button"
                  aria-label="리스트 보기"
                  aria-pressed={viewMode === "list"}
                  onClick={() => setViewMode("list")}
                >
                  <List size={18} strokeWidth={1.8} />
                </button>
              </div>
            </div>

            <div className={viewMode === "grid" ? "blog-post-grid" : "blog-post-list"}>
              {sortedPosts.map((post) => (
                <Link className="blog-post-card" href={`/blog/${post.slug}`} key={`${currentPage}-${post.id}`}>
                  <BlogThumbnail post={post} />
                  <div className="blog-post-body">
                    <h2>{post.title}</h2>
                    {viewMode === "list" ? <p>{post.excerpt}</p> : null}
                    <time dateTime={post.date}>{post.date}</time>
                  </div>
                </Link>
              ))}
            </div>

            <nav className="blog-pagination" aria-label="블로그 페이지네이션">
              <button
                type="button"
                aria-label="이전 페이지"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              >
                <ChevronLeft size={18} strokeWidth={1.8} />
              </button>
              {pageNumbers.map((page) => (
                <button
                  className={page === currentPage ? "is-active" : ""}
                  type="button"
                  key={page}
                  aria-label={`${page} 페이지`}
                  aria-current={page === currentPage ? "page" : undefined}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
              <button
                type="button"
                aria-label="다음 페이지"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              >
                <ChevronRight size={18} strokeWidth={1.8} />
              </button>
            </nav>
          </div>
        </div>
      </section>
    </main>
  );
}
