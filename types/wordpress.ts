export interface Category {
  slug: string;
  name: string;
  count: number;
}

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  thumbnail: string;
  category: { slug: string; name: string };
}
