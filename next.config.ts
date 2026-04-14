import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,  // ← ignores TS errors during build
  },
  images: {

    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "*.fbcdn.net" }, // avatars Facebook
      { protocol: "https", hostname: "platform-lookaside.fbsbx.com" },

    ],
  },
}

export default nextConfig;
