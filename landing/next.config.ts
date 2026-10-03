import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // landing/ sits inside the uniba.ac.id repo, whose root has its own lockfile.
  // Without this Next infers the repo root as the workspace and traces from there.
  turbopack: { root: path.join(__dirname) },
};

export default nextConfig;
