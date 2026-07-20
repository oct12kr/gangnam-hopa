import type { Metadata } from "next";
import BostonLanding from "@/components/sections/BostonLanding";
import { location, phoneNumber } from "@/components/sections/content";
import {
  addressLocality,
  addressRegion,
  businessName,
  detailAddress,
  latitude,
  longitude,
  roadAddress,
  siteUrl,
  venueName,
} from "@/lib/constants";
import { absoluteAssetUrl, buildMetaDescription, buildMetaTitle, canonicalUrl, defaultSeo } from "@/lib/seo";

const homeTitle = buildMetaTitle(defaultSeo.homeTitle);
const homeDescription = buildMetaDescription({
  description: defaultSeo.homeDescription,
});
const homeUrl = canonicalUrl("/");
const homeOgImage = absoluteAssetUrl("/og.png");

export const metadata: Metadata = {
  title: homeTitle,
  description: homeDescription,
  alternates: {
    canonical: homeUrl,
  },
  openGraph: {
    type: "website",
    locale: defaultSeo.locale,
    url: homeUrl,
    siteName: defaultSeo.siteName,
    title: homeTitle,
    description: homeDescription,
    images: [
      {
        url: homeOgImage,
        width: 1200,
        height: 630,
        alt: `${businessName} 프리미엄 라운지`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: homeTitle,
    description: homeDescription,
    images: [homeOgImage],
  },
};

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteUrl}/#organization`,
  name: businessName,
  url: siteUrl,
  logo: absoluteAssetUrl("/favicon.svg"),
  contactPoint: {
    "@type": "ContactPoint",
    telephone: phoneNumber,
    contactType: "customer service",
    areaServed: "KR-11",
    availableLanguage: ["ko-KR", "Korean"],
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${siteUrl}/#localbusiness`,
  name: businessName,
  alternateName: ["강남호빠", venueName],
  description: homeDescription,
  url: siteUrl,
  image: [homeOgImage, absoluteAssetUrl("/images/hero/000.png"), absoluteAssetUrl("/images/888.png")],
  telephone: phoneNumber,
  priceRange: "상담 후 안내",
  address: {
    "@type": "PostalAddress",
    streetAddress: `${roadAddress} (${detailAddress})`,
    addressLocality,
    addressRegion,
    addressCountry: "KR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude,
    longitude,
  },
  areaServed: [addressRegion, addressLocality, location.address, location.roadAddress],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: phoneNumber,
    contactType: "reservations",
    availableLanguage: ["ko-KR", "Korean"],
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  name: businessName,
  url: siteUrl,
  inLanguage: "ko-KR",
  publisher: {
    "@id": `${siteUrl}/#organization`,
  },
};

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${homeUrl}#webpage`,
  url: homeUrl,
  name: homeTitle,
  description: homeDescription,
  isPartOf: {
    "@id": `${siteUrl}/#website`,
  },
  about: {
    "@id": `${siteUrl}/#localbusiness`,
  },
  inLanguage: "ko-KR",
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: businessName,
      item: homeUrl,
    },
  ],
};

export default function Home() {
  return (
    <>
      <JsonLd data={organizationSchema} />
      <JsonLd data={localBusinessSchema} />
      <JsonLd data={websiteSchema} />
      <JsonLd data={webPageSchema} />
      <JsonLd data={breadcrumbSchema} />
      <BostonLanding />
    </>
  );
}
