/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://her-style-v1.vercel.app/', // Replace with your site's URL
  generateRobotsTxt: true, // (optional) Generate robots.txt file
  changefreq: 'daily', // How often the content changes (e.g., daily, weekly)
  priority: 0.7, // Default priority for all URLs
  sitemapSize: 5000, // Maximum number of entries per sitemap file
  exclude: ['/admin/*'], // Paths to exclude from the sitemap

};
