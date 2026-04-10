import DiscountListCMS from "@/components/indexes/DiscountListCMS";
import PageContainerCMS from "@/components/pages/PageContainerCMS";
import ForbiddenComponent from "@/components/states/403Forbidden";
import { setSessionToken, trpc } from "@/trpc/server";
import { cookies } from "next/headers";

export default async function DiscountsPageCMS() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) return null;
  setSessionToken(sessionToken);

  // Client-side Authorization
  const userSession = await trpc.auth.checkSession();
  const allowedRolesListDiscount = [0];

  if (!allowedRolesListDiscount.includes(userSession.user.role_id)) {
    return (
      <PageContainerCMS>
        <ForbiddenComponent />
      </PageContainerCMS>
    );
  }

  return <DiscountListCMS sessionToken={sessionToken} />;
}
