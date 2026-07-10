import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "monis.rent" },
      { protocol: "https", hostname: "www.monis.rent" },
    ],
  },
};

export default nextConfig;
