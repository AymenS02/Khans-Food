import type { NextConfig } from "next";

const cloudinaryCloudName =
  process.env
    .CLOUDINARY_CLOUD_NAME;

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: cloudinaryCloudName
          ? `/${cloudinaryCloudName}/image/upload/**`
          : "/**",
      },
    ],
  },
};

export default nextConfig;