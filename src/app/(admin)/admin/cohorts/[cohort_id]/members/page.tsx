import CohortMemberListCMS from "@/app/components/indexes/CohortMemberListCMS";
import ForbiddenComponent from "@/app/components/states/403Forbidden";
import { setSessionToken, trpc } from "@/trpc/server";
import { cookies } from "next/headers";

interface MembersPageProps {
  params: Promise<{ cohort_id: string }>;
}

export default async function MembersPage({ params }: MembersPageProps) {
  const { cohort_id } = await params;
  const cohortId = parseInt(cohort_id);

  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) return null;
  setSessionToken(sessionToken);

  const userSession = await trpc.auth.checkSession();
  const allowedRolesMemberList = [0, 1, 2, 3];

  if (!allowedRolesMemberList.includes(userSession.user.role_id)) {
    return (
      <div className="forbidden flex w-full h-full pl-64">
        <ForbiddenComponent />
      </div>
    );
  }

  return (
    <div className="root hidden w-full h-full justify-center bg-white py-8 lg:flex lg:pl-64">
      <CohortMemberListCMS
        sessionToken={sessionToken}
        sessionUserId={userSession.user.id}
        sessionUserRole={userSession.user.role_id}
        cohortId={cohortId}
      />
    </div>
  );
}
