import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [{ source: "/tmp", destination: "/", permanent: true }];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.mojacarestates.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "members.alphashare.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
