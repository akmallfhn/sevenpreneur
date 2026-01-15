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
      url: `https://www.${domain}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1.0,
    },
    {
      url: `https://www.${domain}/terms-conditions`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1.0,
    },
    {
      url: `https://www.${domain}/company`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1.0,
    },
  ];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  sitemaps.forEach((item) => {
    xml += `
        <url>
            <loc>${item.url}</loc>
            <lastmod>${item.lastModified.toISOString()}</lastmod>
            <changefreq>${item.changeFrequency}</changefreq>
            <priority>${item.priority.toFixed(1)}</priority>
        </url>`;
  });
  xml += "</urlset>";

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
