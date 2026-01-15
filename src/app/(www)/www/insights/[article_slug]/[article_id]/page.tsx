import ArticleDetailsSVP from "@/app/components/pages/ArticleDetailsSVP";
import { setSecretKey, trpc } from "@/trpc/server";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

interface ArticleDetailsPageLMSProps {
  params: Promise<{ article_id: string; article_slug: string }>;
}

export async function generateMetadata({
  params,
}: ArticleDetailsPageLMSProps): Promise<Metadata> {
  const { article_id } = await params;
  const articleId = parseInt(article_id, 10);

  const secretKey = process.env.SECRET_KEY_PUBLIC_API;
  setSecretKey(secretKey!);

  const BASE_URL = "https://www.sevenpreneur.com";

  const articleData = (await trpc.read.article({ id: articleId })).article;

  if (articleData.status !== "PUBLISHED") {
    return {
      title: `404 Not Found`,
      description:
        "Sorry, the page you’re looking for doesn’t exist or may have been moved.",
      robots: {
        index: false,
        follow: false,
        googleBot: {
          index: false,
          follow: false,
        },
      },
    };
  }

  return {
    title: `${articleData.title} | Sevenpreneur Insights`,
    description: articleData.insight,
    keywords: articleData.keywords,
    authors: [{ name: "Sevenpreneur" }],
    publisher: "Sevenpreneur",
    referrer: "origin-when-cross-origin",
    alternates: {
      canonical: `${BASE_URL}/insights/${articleData.slug_url}/${articleData.id}`,
    },
    openGraph: {
      title: `${articleData.title} | Sevenpreneur Insights`,
      description: articleData.insight,
      url: `${BASE_URL}/insights/${articleData.slug_url}/${articleData.id}`,
      siteName: "Sevenpreneur",
      images: [
        {
          url: articleData.image_url,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${articleData.title} | Sevenpreneur Insights`,
      description: articleData.insight,
      images: articleData.image_url,
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
}

export default async function ArticleDetailsPageLMS({
  params,
}: ArticleDetailsPageLMSProps) {
  const { article_id, article_slug } = await params;
  const articleId = parseInt(article_id, 10);

  const secretKey = process.env.SECRET_KEY_PUBLIC_API;
  setSecretKey(secretKey!);

  let articleDataRaw;
  try {
    articleDataRaw = (await trpc.read.article({ id: articleId })).article;
  } catch {
    return notFound();
  }

  const articleData = {
    ...articleDataRaw,
    published_at: articleDataRaw.published_at.toISOString(),
    updated_at: articleDataRaw.updated_at.toISOString(),
  };

  // Return 404 if INACTIVE status
  if (articleData.status !== "PUBLISHED") {
    return notFound();
  }

  // Auto Correction Slug
  const correctSlug = articleData.slug_url;
  if (article_slug !== correctSlug) {
    redirect(`/insights/${correctSlug}/${articleId}`);
  }

  return (
    <ArticleDetailsSVP
      articleId={articleData.id}
      articleTitle={articleData.title}
      articleImage={articleData.image_url}
      articleCategory={articleData.category.name}
      articleDate={articleData.published_at}
      articleInsight={articleData.insight}
      articleSlug={articleData.slug_url}
      articleBody={articleData.body_content}
      articleReadingTime={articleData.reading_time}
      articleAuthorName={articleData.author.full_name}
      articleAuthorAvatar={
        articleData.author.avatar ||
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/default-avatar.svg.png"
      }
    />
  );
}
