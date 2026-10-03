import path from "node:path";
import type { NextConfig } from "next";

// Arsitektur §16: standalone untuk image Cloud Run, header X-Powered-By dimatikan,
// dan turbopack.root ditulis eksplisit. Di repo ini root wajib eksplisit karena
// landing/ punya lockfile sendiri dan tidak boleh ikut terbaca sebagai workspace.
const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  turbopack: { root: path.join(__dirname) },
};

export default nextConfig;
