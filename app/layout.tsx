import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const notoSansKr = localFont({
  src: "./fonts/NotoSansKR-VF.ttf",
  variable: "--font-noto-kr",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://gangnam-boston.local"),
  title: "강남보스턴 BOSTON | 강남 프리미엄 퍼블릭",
  description: "강남보스턴 BOSTON 프리미엄 랜딩페이지. 예약 문의 010-8288-8854, 서울특별시 강남구 삼성동 143-27.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "강남보스턴 BOSTON",
    description: "강남 프리미엄 퍼블릭, 품격있는 서비스와 최고의 시간을 경험하십시오.",
    images: ["/og.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "강남보스턴 BOSTON",
    description: "예약문의 010-8288-8854",
    images: ["/og.png"],
  },
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
