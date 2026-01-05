import ArticleListCMS from "@/app/components/indexes/ArticleListCMS";
import ForbiddenComponent from "@/app/components/states/403Forbidden";
import { setSessionToken, trpc } from "@/trpc/server";
import { cookies } from "next/headers";

export default async function ArticlesPageCMS() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) return null;
  setSessionToken(sessionToken);

  const userSession = await trpc.auth.checkSession();
  const allowedRolesListArticle = [0, 4];

  if (!allowedRolesListArticle.includes(userSession.user.role_id)) {
    return (
      <div className="forbidden flex w-full h-full pl-64">
        <ForbiddenComponent />
      </div>
    );
  }

  return (
    <ArticleListCMS
      sessionToken={sessionToken}
      sessionUserRole={userSession.user.role_id}
    />
  );
}
