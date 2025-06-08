import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* to resolve https://github.com/rainbow-me/rainbowkit/issues/1368*/
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
};

export default nextConfig;
