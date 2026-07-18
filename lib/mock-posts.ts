import type { BlogPost, Category } from "@/types/wordpress";

export const categories: Category[] = [{ slug: "gangnam-hobba", name: "강남호빠", count: 12 }];

export const mockPosts: BlogPost[] = [
  {
    id: 1,
    slug: "premium-service-introduction",
    title: "강남보스턴 프리미엄 서비스 소개",
    excerpt: "강남보스턴만의 프리미엄 서비스와 공간 무드를 소개합니다.",
    date: "2024.06.01",
    thumbnail: "gradient",
    category: { slug: "gangnam-hobba", name: "강남호빠" },
  },
  {
    id: 2,
    slug: "best-host-time",
    title: "최고의 호스트와 함께하는 시간",
    excerpt: "편안한 응대와 세심한 안내로 완성되는 시간을 전합니다.",
    date: "2024.05.28",
    thumbnail: "gradient",
    category: { slug: "gangnam-hobba", name: "강남호빠" },
  },
  {
    id: 3,
    slug: "vip-private-space",
    title: "VIP를 위한 특별한 공간",
    excerpt: "프라이빗한 분위기와 고급스러운 공간 구성을 안내합니다.",
    date: "2024.05.25",
    thumbnail: "gradient",
    category: { slug: "gangnam-hobba", name: "강남호빠" },
  },
  {
    id: 4,
    slug: "gangnam-boston-system-guide",
    title: "강남보스턴 시스템 안내",
    excerpt: "예약부터 이용까지 자연스럽게 이어지는 시스템을 정리했습니다.",
    date: "2024.05.22",
    thumbnail: "gradient",
    category: { slug: "gangnam-hobba", name: "강남호빠" },
  },
  {
    id: 5,
    slug: "events-and-benefits",
    title: "다양한 이벤트와 혜택",
    excerpt: "시즌별 이벤트와 방문 혜택 정보를 한눈에 확인하세요.",
    date: "2024.05.18",
    thumbnail: "gradient",
    category: { slug: "gangnam-hobba", name: "강남호빠" },
  },
  {
    id: 6,
    slug: "private-room-guide",
    title: "프라이빗 룸 안내",
    excerpt: "조용하고 독립적인 이용을 위한 프라이빗 룸 정보를 소개합니다.",
    date: "2024.05.15",
    thumbnail: "gradient",
    category: { slug: "gangnam-hobba", name: "강남호빠" },
  },
  {
    id: 7,
    slug: "location-guide",
    title: "오시는 길 및 위치 안내",
    excerpt: "방문 전 확인하면 좋은 주소와 이동 정보를 정리했습니다.",
    date: "2024.05.12",
    thumbnail: "gradient",
    category: { slug: "gangnam-hobba", name: "강남호빠" },
  },
  {
    id: 8,
    slug: "reservation-use-guide",
    title: "예약 및 이용 안내",
    excerpt: "전화 예약과 이용 흐름을 간단하게 안내합니다.",
    date: "2024.05.08",
    thumbnail: "gradient",
    category: { slug: "gangnam-hobba", name: "강남호빠" },
  },
  {
    id: 9,
    slug: "gangnam-boston-gallery",
    title: "강남보스턴 갤러리",
    excerpt: "공간 분위기와 대표적인 인테리어 무드를 확인해보세요.",
    date: "2024.05.05",
    thumbnail: "gradient",
    category: { slug: "gangnam-hobba", name: "강남호빠" },
  },
  {
    id: 10,
    slug: "special-service-story",
    title: "특별한 서비스 이야기",
    excerpt: "강남보스턴이 추구하는 서비스 방향을 담았습니다.",
    date: "2024.05.02",
    thumbnail: "gradient",
    category: { slug: "gangnam-hobba", name: "강남호빠" },
  },
  {
    id: 11,
    slug: "customer-review-interview",
    title: "고객 후기 인터뷰",
    excerpt: "방문 경험을 바탕으로 한 후기와 분위기 이야기를 전합니다.",
    date: "2024.04.28",
    thumbnail: "gradient",
    category: { slug: "gangnam-hobba", name: "강남호빠" },
  },
  {
    id: 12,
    slug: "gangnam-boston-news",
    title: "강남보스턴 소식",
    excerpt: "운영 안내와 새로운 소식을 모아 전합니다.",
    date: "2024.04.25",
    thumbnail: "gradient",
    category: { slug: "gangnam-hobba", name: "강남호빠" },
  },
];

type MockPostParams = {
  page?: number;
  perPage?: number;
  category?: string;
};

export function mockGetPosts({ page = 1, perPage = 12, category }: MockPostParams = {}) {
  const filteredPosts = category ? mockPosts.filter((post) => post.category.slug === category) : mockPosts;
  const actualTotalPages = Math.max(1, Math.ceil(filteredPosts.length / perPage));
  const totalPages = Math.max(3, actualTotalPages);
  const visiblePage = page <= actualTotalPages ? page : 1;
  const start = (visiblePage - 1) * perPage;

  return {
    posts: filteredPosts.slice(start, start + perPage),
    totalPages,
    total: filteredPosts.length,
  };
}
