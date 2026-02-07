import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  images: {
    unoptimized: true,
  },
  // basePath: '/myPage', // Replace 'myPage' with your repository name
};

export default nextConfig;
