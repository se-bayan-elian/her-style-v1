/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://her-style-v1.vercel.app/', // Replace with your site's URL
  generateRobotsTxt: true, // (optional) Generate robots.txt file
  changefreq: 'daily', // How often the content changes (e.g., daily, weekly)
  priority: 0.7, // Default priority for all URLs
  sitemapSize: 5000, // Maximum number of entries per sitemap file
  exclude: ['/admin/*'], // Paths to exclude from the sitemap

  robotsTxtOptions: {
    additionalSitemaps: [
      // Add additional sitemaps here if needed
      `${process.env.NEXT_PUBLIC_BASE_URL}/sitemap.xml`,
    ],
    policies: [
      // Allow all user agents access to your pages
      {
        userAgent: '*',
        allow: '/',
      },
      // Allow Facebook and WhatsApp specific crawlers
      {
        userAgent: 'FacebookExternalHit',
        allow: '/',
      },
      {
        userAgent: 'WhatsApp',
        allow: '/',
      },
      // Optionally, you can block admin pages (if needed)
      {
        userAgent: '*',
        disallow: ['/admin/*'],
      },
    ],
  },
};
