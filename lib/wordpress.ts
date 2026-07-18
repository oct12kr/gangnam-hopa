import { mockGetPosts } from "@/lib/mock-posts";
import type { BlogPost } from "@/types/wordpress";

export async function getPosts(params: {
  page?: number;
  perPage?: number;
  category?: string;
}): Promise<{ posts: BlogPost[]; totalPages: number; total: number }> {
  // TODO: NEXT_PUBLIC_WP_API_URL 확정되면 아래 방식으로 교체
  // const res = await fetch(`${WP_API_URL}/posts?_embed&page=${params.page}&per_page=${params.perPage}&categories=${categoryId}`)
  // 지금은 mock 데이터로 페이지네이션/카테고리 필터링 로직만 동일하게 구현
  return mockGetPosts(params);
}
