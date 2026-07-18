import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gangnamboston.net",
      },
      {
        protocol: "https",
        hostname: "public-api.wordpress.com",
      },
    ],
  },
};

export default nextConfig;
