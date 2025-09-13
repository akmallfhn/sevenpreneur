import { NextResponse } from "next/server";

export function GET() {
  let domain = "sevenpreneur.com";
  if (process.env.DOMAIN_MODE === "local") {
    domain = "example.com:3000";
  }

  const sitemaps = [
    {
      url: `https://www.${domain}`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1.0,
    },
    {
      url: `https://www.${domain}/events/restart-conference`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1.0,
    },
    {
      url: `https://www.${domain}/cohorts/sevenpreneur-business-blueprint-program`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1.0,
    },
  ];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  sitemaps.forEach((sitemapItem) => {
    xml += `
        <url>
            <loc>${sitemapItem.url}</loc>
            <lastmod>${sitemapItem.lastModified.toISOString()}</lastmod>
            <changefreq>${sitemapItem.changeFrequency}</changefreq>
            <priority>${sitemapItem.priority.toFixed(1)}</priority>
        </url>`;
  });
  xml += "</urlset>";

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
