import { NextResponse } from "next/server";

export async function GET() {
    const BASE_URL = "https://www.sevenpreneur.com"

    const sitemaps = [
        {
        url: `${BASE_URL}`,
        lastModified: new Date(),
        changeFrequency: "yearly",
        priority: 1.0,
        },
    ];

    let xml = '<?xml version="1.0" encoding="UTF-8"?>'
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
    sitemaps.forEach((sitemapItem) => {
        xml += `
        <url>
            <loc>${sitemapItem.url}</loc>
            <lastmod>${sitemapItem.lastModified.toISOString()}</lastmod>
            <changefreq>${sitemapItem.changeFrequency}</changefreq>
            <priority>${sitemapItem.priority.toFixed(1)}</priority>
        </url>`;
    });
    xml += '</urlset>';

    return new NextResponse(xml, {
    headers: {
        "Content-Type": "application/xml",
    }});
    
}