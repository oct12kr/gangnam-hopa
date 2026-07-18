import type { Metadata } from "next";
import { BlogArchive } from "@/components/sections/BlogSection";
import SiteHeader from "@/components/ui/SiteHeader";

export const metadata: Metadata = {
  title: "Blog | 강남보스턴 BOSTON",
  description: "강남보스턴의 최신 운영 안내, 이벤트, 공지사항, 방문 후기 목록입니다.",
};

export default function BlogPage() {
  return (
    <>
      <SiteHeader mode="blog" />
      <BlogArchive />
    </>
  );
}
