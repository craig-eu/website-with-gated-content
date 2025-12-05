import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    async rewrites() {
        return [
            {
                source: "/admin",
                destination: "/admin/index.html",
            },
            {
                source: "/admin/:path*",
                destination: "/admin/index.html",
            },
        ];
    },
};

export default nextConfig;
