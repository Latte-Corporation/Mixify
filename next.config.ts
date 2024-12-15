import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  /* config options here */

  webpack: (config) => {
    config.resolve.fallback = { fs: false };

    return config;
  },
  output: "standalone",
  env: {
    API_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
  },
};



export default withNextIntl(nextConfig);
