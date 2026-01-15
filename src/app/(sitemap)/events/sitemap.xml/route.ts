import { setSecretKey, trpc } from "@/trpc/server";
import { NextResponse } from "next/server";

export async function GET() {
  const secretKey = process.env.SECRET_KEY_PUBLIC_API;
  setSecretKey(secretKey!);

  let domain = "sevenpreneur.com";
  if (process.env.DOMAIN_MODE === "local") {
    domain = "example.com:3000";
  }

  const eventListData = await trpc.list.events({});

  const communityEvent = eventListData.list.map((post) => ({
    url: `https://www.${domain}/events/${post.slug_url}/${post.id}`,
    lastModified: new Date(),
  }));

  const flagshipEvent = {
    url: `https://www.${domain}/events/restart-conference`,
    lastModified: new Date(),
  };

  const mergedEvent = [flagshipEvent, ...communityEvent];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  mergedEvent.forEach((item) => {
    xml += `
        <url>
            <loc>${item.url}</loc>
            <lastmod>${item.lastModified.toISOString()}</lastmod>
        </url>`;
  });
  xml += "</urlset>";

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
