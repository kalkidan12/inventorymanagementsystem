/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // Your existing sitemap rewrite
      {
        source: "/sitemap.xml",
        destination: "/api/sitemap",
      },

      // ✅ New rewrite to serve images from Nginx (port 8080)
      {
        source: "/uploads/:path*",
        destination: "http://localhost/uploads/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
