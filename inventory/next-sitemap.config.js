// next-sitemap.config.js
module.exports = {
  siteUrl: process.env.SITE_URL || "https://kaliget.com",
  generateRobotsTxt: true,
  changefreq: "daily",
  priority: 0.8,
  sitemapSize: 7000,
  exclude: ["/admin/*", "/dashboard/*"],
};
