import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  outputFileTracingIncludes: {
    '/api/**/*': ['./lib/generated/prisma/**/*'],
    '/*': ['./lib/generated/prisma/**/*'],
  },
};

export default nextConfig;
