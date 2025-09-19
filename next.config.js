/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "source.unsplash.com",
      "images.unsplash.com",
      "ext.same-assets.com",
      "ugc.same-assets.com",
      "localhost",
    ],
    unoptimized: false,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "source.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ext.same-assets.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ugc.same-assets.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/**",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    typedRoutes: false,
  },
  async rewrites() {
    return [
      // HTML extensions redirect to same page without .html
      {
        source: '/gallery.html',
        destination: '/gallery',
      },
      {
        source: '/shop.html',
        destination: '/shop',
      },
      {
        source: '/about.html',
        destination: '/about',
      },
      {
        source: '/contact.html',
        destination: '/contact',
      },
      {
        source: '/blogs.html',
        destination: '/blogs',
      },
      {
        source: '/index.html',
        destination: '/',
      },
      // Main routes
      {
        source: '/gallery',
        destination: '/gallery',
      },
      {
        source: '/shop',
        destination: '/shop',
      },
      {
        source: '/about',
        destination: '/about.html',
      },
      {
        source: '/contact',
        destination: '/contact.html',
      },
      {
        source: '/blogs',
        destination: '/blogs.html',
      },
    ];
  },
};

module.exports = nextConfig;
