import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Pace 앱은 pace.minahdev.cloud 로 옮겼다. 짧은 링크용.
      { source: "/pace", destination: "https://pace.minahdev.cloud", permanent: false },
    ];
  },
};

export default nextConfig;
