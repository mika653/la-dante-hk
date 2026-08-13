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
  // nodemailer is a Node-only package (used by the SMTP mailer) — keep it out
  // of the bundle so it runs natively on the server.
  serverExternalPackages: ["nodemailer"],
  experimental: {
    // Media Library uploads go through a Server Action as multipart form data;
    // the default 1 MB cap is too small for photos.
    serverActions: { bodySizeLimit: "10mb" },
  },
};

export default nextConfig;
