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
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "gangnamhopa.com",
          },
        ],
        destination: "https://www.gangnamhopa.com/:path*",
        statusCode: 301,
      },
    ];
  },
};

export default nextConfig;
