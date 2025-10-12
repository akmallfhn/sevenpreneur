import CohortListLMS from "@/app/components/indexes/CohortListLMS";
import { setSessionToken, trpc } from "@/trpc/server";
import { cookies } from "next/headers";

export default async function CohortsPageLMS() {
  // Get Token for Header Navbar
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;
  if (!sessionToken) return null;

  if (sessionToken) {
    setSessionToken(sessionToken);
  }

  // Fetch tRPC User Data
  const userData = (await trpc.auth.checkSession()).user;

  return (
    <CohortListLMS
      userName={userData.full_name}
      userAvatar={
        userData.avatar ||
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/default-avatar.svg.png"
      }
      userRole={userData.role_id}
    />
  );
}
