import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { businessName, siteUrl } from "@/lib/constants";
import { absoluteAssetUrl, buildMetaDescription, buildMetaTitle, canonicalUrl, defaultSeo } from "@/lib/seo";
import "./globals.css";

const notoSansKr = localFont({
  src: "./fonts/NotoSansKR-VF.ttf",
  variable: "--font-noto-kr",
  weight: "100 900",
  display: "swap",
});

const fallbackTitle = buildMetaTitle(defaultSeo.fallbackTitle);
const fallbackDescription = buildMetaDescription({
  description: defaultSeo.fallbackDescription,
});
const defaultOgImage = absoluteAssetUrl(defaultSeo.defaultImage);

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: fallbackTitle,
  description: fallbackDescription,
  keywords: [
    "강남호빠",
    "강남 호빠",
    "강남보스턴",
    "강남보스턴 BOSTON",
    "강남 프리미엄 라운지",
    "삼성동 호빠",
    "강남호빠 예약",
  ],
  alternates: {
    canonical: canonicalUrl("/"),
  },
  applicationName: businessName,
  authors: [{ name: businessName, url: siteUrl }],
  creator: businessName,
  publisher: businessName,
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: defaultSeo.locale,
    url: canonicalUrl("/"),
    siteName: defaultSeo.siteName,
    title: fallbackTitle,
    description: fallbackDescription,
    images: [
      {
        url: defaultOgImage,
        width: 1200,
        height: 630,
        alt: `${businessName} 대표 이미지`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: fallbackTitle,
    description: fallbackDescription,
    images: [defaultOgImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0b0b0b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${notoSansKr.variable} antialiased`}>{children}</body>
    </html>
  );
}
