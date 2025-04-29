import type { NextConfig } from "next";
import configuration from "./envConfig";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {},
  output: "standalone",
  rewrites: async () => {
    console.log({ configuration });
    if (configuration.apiUrl) {
      return [
        {
          source: "/api/v1.0/:path*",
          destination: `${configuration.apiUrl}/api/v1.0/:path*`,
        },
      ];
    }
    return [];
    // return [
    //   {
    //     source: "/api/v1.0/:path*",
    //     destination: "http://localhost:8082/api/v1.0/:path*", // <-- your backend URL
    //   },
    // ];
  },
};

export default nextConfig;
