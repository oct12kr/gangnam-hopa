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
      {
        protocol: "https",
        hostname: "wordpress-1628102-6558612.cloudwaysapps.com",
      },
    ],
  },
};

export default nextConfig;
