import ArticleDetailsSVP from "@/app/components/pages/ArticleDetailsSVP";
import { setSecretKey } from "@/trpc/server";

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

  return (
    <ArticleDetailsSVP
      articleId={articleId}
      articleTitle={
        "11 Rekomendasi Aplikasi Perjalanan Dinas untuk PNS & Karyawan"
      }
      articleImage="https://mekari.com/wp-content/uploads/2025/12/mekari-expense-aplikasi-perjalaan-dinas-featured-image.webp"
      articleDate="10 Sep 2020"
      articleSlug={article_slug}
      articleBody={"test"}
    />
  );
}
