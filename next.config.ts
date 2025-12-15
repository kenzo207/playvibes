import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.scdn.co" },
      { protocol: "https", hostname: "mosaic.scdn.co" },
      { protocol: "https", hostname: "wrapped-images.spotifycdn.com" },
      { protocol: "https", hostname: "seed-mix-image.spotifycdn.com" },
      { protocol: "https", hostname: "image-cdn-ak.spotifycdn.com" },
      { protocol: "https", hostname: "image-cdn-fa.spotifycdn.com" },
      { protocol: "https", hostname: "lineup-images.scdn.co" },
      { protocol: "https", hostname: "newjams-images.spotifycdn.com" },
      { protocol: "https", hostname: "daily-mix.scdn.co" },
      { protocol: "https", hostname: "dailymix-images.scdn.co" },
      { protocol: "https", hostname: "t.scdn.co" },
      { protocol: "https", hostname: "platform-lookaside.fbsbx.com" }, // Facebook
      { protocol: "https", hostname: "scontent.xx.fbcdn.net" }, // Facebook CDN
      { protocol: "https", hostname: "lh3.googleusercontent.com" }, // Google
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
