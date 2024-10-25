import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets-stg.transak.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "assets.transak.com",
        port: "",
      },
    ],
  },
};

export default nextConfig;
