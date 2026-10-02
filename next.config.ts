import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["sql.js"],
  // sql.js loads its WASM binary at runtime, so the tracer can't detect it on its own
  outputFileTracingIncludes: {
    "/api/**": ["./node_modules/sql.js/dist/sql-wasm.wasm"],
  },
};

export default nextConfig;
