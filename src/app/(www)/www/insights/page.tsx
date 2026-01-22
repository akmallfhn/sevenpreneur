import ArticleListSVP from "@/app/components/indexes/ArticleListSVP";
import { setSecretKey, trpc } from "@/trpc/server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Insights | Sevenpreneur",
  description:
    "Update news, tips, dan insight seputar bisnis, ekonomi, dan AI. Sevenpreneur Insight ditulis untuk entrepreneur, founder, dan profesional digital.",
  authors: [{ name: "Sevenpreneur Team" }],
  publisher: "Sevenpreneur",
  referrer: "origin-when-cross-origin",
  alternates: {
    canonical: "/insights",
  },
  openGraph: {
    title: "Insights | Sevenpreneur",
    description:
      "Update news, tips, dan insight seputar bisnis, ekonomi, dan AI. Sevenpreneur Insight ditulis untuk entrepreneur, founder, dan profesional digital.",
    url: "/insights",
    siteName: "Sevenpreneur",
    images: [
      {
        url: "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/meta-og-image-sevenpreneur-1.webp",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Insights | Sevenpreneur",
    description:
      "Update news, tips, dan insight seputar bisnis, ekonomi, dan AI. Sevenpreneur Insight ditulis untuk entrepreneur, founder, dan profesional digital.",
    images:
      "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/meta-og-image-sevenpreneur-1.webp",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default async function ArticlesPage() {
  const secretKey = process.env.SECRET_KEY_PUBLIC_API;
  setSecretKey(secretKey!);

  const articleData = (await trpc.list.articles({})).list;

  const articleList = articleData.map((item) => ({
    ...item,
    published_at: item.published_at ? item.published_at.toISOString() : "",
  }));

  return <ArticleListSVP articleList={articleList} />;
}
