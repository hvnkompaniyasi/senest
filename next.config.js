/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: false,
    remotePatterns: [
      { protocol: "https", hostname: "utfs.io" },
      { protocol: "https", hostname: "**.ufs.io" },
      { protocol: "https", hostname: "**.ufslive.com" },
      { protocol: "https", hostname: "*.ufs.sh" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
}

module.exports = nextConfig
