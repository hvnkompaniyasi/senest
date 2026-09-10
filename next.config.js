/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "utfs.io" },
      { protocol: "https", hostname: "**.ufs.io" },
      { protocol: "https", hostname: "**.ufslive.com" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
}

module.exports = nextConfig
