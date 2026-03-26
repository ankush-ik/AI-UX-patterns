import type { NextConfig } from "next";

const remotePatterns = [
  {
    protocol: "https" as const,
    hostname: "cdn.prod.website-files.com",
  },
  {
    protocol: "https" as const,
    hostname: "images.unsplash.com",
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
  },
};

export default nextConfig;
