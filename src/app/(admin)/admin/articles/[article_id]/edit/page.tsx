import EditArticleForm from "@/app/components/forms/EditArticleFormCMS";
import ForbiddenComponent from "@/app/components/states/403Forbidden";
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
      <div className="forbidden flex w-full h-full pl-64">
        <ForbiddenComponent />
      </div>
    );
  }

  return <EditArticleForm sessionToken={sessionToken} articleId={articleId} />;
}
