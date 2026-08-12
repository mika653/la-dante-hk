import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
      // Vercel Blob (Media Library uploads)
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
  experimental: {
    // Media Library uploads go through a Server Action as multipart form data;
    // the default 1 MB cap is too small for photos.
    serverActions: { bodySizeLimit: "10mb" },
  },
};

export default nextConfig;
