import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The landing moved from daftaruniba.site to daftar.uniba.ac.id. Every old
  // URL (path and query, so gclid/UTM survive) lands on the same page there.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "(?:www\\.)?daftaruniba\\.site" }],
        destination: "https://daftar.uniba.ac.id/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
