import type { Metadata } from "next";
import BlogIndexPage from "@/components/sections/BlogIndexPage";
import Footer from "@/components/sections/Footer";
import SiteHeader from "@/components/ui/SiteHeader";
import { businessName, siteUrl } from "@/lib/constants";
import { absoluteAssetUrl, buildMetaDescription, buildMetaTitle, canonicalUrl, defaultSeo } from "@/lib/seo";

const blogTitle = buildMetaTitle("강남호빠 블로그 | 예약 가이드와 최신 소식");
const blogDescription = buildMetaDescription({
  description:
    "강남보스턴 BOSTON의 최신 운영 안내, 예약 전 확인할 정보, 이벤트와 방문 팁을 블로그에서 한 번에 확인해 보세요.",
});
const blogUrl = canonicalUrl("/blog");
const blogOgImage = absoluteAssetUrl(defaultSeo.blogImage);

export const metadata: Metadata = {
  title: blogTitle,
  description: blogDescription,
  alternates: {
    canonical: blogUrl,
  },
  openGraph: {
    type: "website",
    locale: defaultSeo.locale,
    url: blogUrl,
    siteName: defaultSeo.siteName,
    title: blogTitle,
    description: blogDescription,
    images: [
      {
        url: blogOgImage,
        width: 1200,
        height: 630,
        alt: `${businessName} 블로그 대표 이미지`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: blogTitle,
    description: blogDescription,
    images: [blogOgImage],
  },
};

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  "@id": `${blogUrl}#blog`,
  name: blogTitle,
  description: blogDescription,
  url: blogUrl,
  inLanguage: "ko-KR",
  publisher: {
    "@type": "Organization",
    name: businessName,
    url: siteUrl,
    logo: {
      "@type": "ImageObject",
      url: absoluteAssetUrl("/favicon.svg"),
    },
  },
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
      item: blogUrl,
    },
  ],
};

export default function BlogPage() {
  return (
    <>
      <JsonLd data={blogSchema} />
      <JsonLd data={breadcrumbSchema} />
      <SiteHeader mode="blog" />
      <BlogIndexPage />
      <Footer />
    </>
  );
}
