import { NextResponse } from "next/server";

export async function GET() {
  let domain = "sevenpreneur.com";
  if (process.env.DOMAIN_MODE === "local") {
    domain = "example.com:3000";
  }

  try {
    const sitemaps = [
      {
        url: `https://www.${domain}/sitemap-basic.xml`,
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

async function buildSitemap(sitemaps) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>';
  xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

  for (const sitemapItem of sitemaps) {
    (xml += "<sitemap>"), (xml += `<loc>${sitemapItem.url}</loc>`);
    xml += `<lastmod>${sitemapItem.lastModified.toISOString()}</lastmod>`;
    xml += "</sitemap>";
  }
  xml += "</sitemapindex>";
  return xml;
}
