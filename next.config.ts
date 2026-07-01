import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // TODO: szűkítsd le a végleges kép-tárhely (pl. CDN) hostnevére élesítéskor.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
