import EditArticleForm from "@/components/forms/EditArticleFormCMS";
import PageContainerCMS from "@/components/pages/PageContainerCMS";
import AppPageState from "@/components/states/AppPageState";
import { setSessionToken, trpc } from "@/trpc/server";
import { cookies } from "next/headers";

interface EditArticlePageProps {
  params: Promise<{ article_id: string }>;
}

export default async function EditArticlePage({
  params,
}: EditArticlePageProps) {
  const { article_id } = await params;
  const articleId = parseInt(article_id);
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value ?? "";

  if (!sessionToken) return null;
  setSessionToken(sessionToken);

  // Client-side Authorization
  const userSession = await trpc.auth.checkSession();
  const allowedRolesUpdateArticle = [0, 4];

  if (!allowedRolesUpdateArticle.includes(userSession.user.role_id)) {
    return (
      <PageContainerCMS>
        <AppPageState variant="FORBIDDEN" />
      </PageContainerCMS>
    );
  }

  return <EditArticleForm sessionToken={sessionToken} articleId={articleId} />;
}
