import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async redirects() {
    return [
      {
        source: '/auth',
        destination: '/auth/login',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
