import ArticleDetailsSVP from "@/app/components/pages/ArticleDetailsSVP";
import { setSecretKey, trpc } from "@/trpc/server";
import { notFound, redirect } from "next/navigation";

interface ArticleDetailsPageLMSProps {
  params: Promise<{ article_id: string; article_slug: string }>;
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
      articleDate={articleData.published_at}
      articleSlug={articleData.slug_url}
      articleBody={articleData.body_content}
    />
  );
}
