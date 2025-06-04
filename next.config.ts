import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  crossOrigin: "anonymous",
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Accept",
            value: "application/json",
          },
        ],
      },
    ];
  },
  allowedDevOrigins: ["http://localhost:3000", "*.ngrok-free.app"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "drive.google.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.ngrok-free.app",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "dj-girl.vercel.app",
        pathname: "/**",
      },
      // new URL("https://drive.google.com/**"),
      new URL("https://www.googleapis.com/**"),
    ],
  },
};

export default nextConfig;
