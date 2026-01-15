import { NextResponse } from "next/server";

interface SitemapItem {
  url: string;
  lastModified: Date;
}

export async function GET() {
  let domain = "sevenpreneur.com";
  if (process.env.DOMAIN_MODE === "local") {
    domain = "example.com:3000";
  }

  try {
    const sitemaps = [
      {
        url: `https://www.${domain}/basic/sitemap.xml`,
        lastModified: new Date(),
      },
      {
        url: `https://www.${domain}/cohorts/sitemap.xml`,
        lastModified: new Date(),
      },
      {
        url: `https://www.${domain}/events/sitemap.xml`,
        lastModified: new Date(),
      },
      {
        url: `https://www.${domain}/playlists/sitemap.xml`,
        lastModified: new Date(),
      },
      {
        url: `https://www.${domain}/insights/sitemap.xml`,
        lastModified: new Date(),
      },
    ];
    const sitemapIndexXML = await buildSitemap(sitemaps);
    return new NextResponse(sitemapIndexXML, {
      headers: {
        "Content-Type": "application/xml",
        "Content-Length": Buffer.byteLength(sitemapIndexXML).toString(),
      },
    });
  } catch (error) {
    console.error("Error generating sitemap index:", error);
    return NextResponse.error();
  }
}

async function buildSitemap(sitemaps: SitemapItem[]) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>';
  xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

  for (const item of sitemaps) {
    xml += "<sitemap>";
    xml += `<loc>${item.url}</loc>`;
    xml += `<lastmod>${item.lastModified.toISOString()}</lastmod>`;
    xml += "</sitemap>";
  }
  xml += "</sitemapindex>";
  return xml;
}
