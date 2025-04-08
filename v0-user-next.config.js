/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["images.unsplash.com", "plus.unsplash.com", "source.unsplash.com", "picsum.photos"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig

