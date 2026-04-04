import AccountDetailsLMS from "@/components/pages/AccountDetailsLMS";
import { setSessionToken, trpc } from "@/trpc/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

export default async function AccountPageLMS() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) return null;
  setSessionToken(sessionToken);

  const userData = (await trpc.auth.checkSession()).user;
  const userId = userData.id;

  let userDetails;
  try {
    userDetails = (await trpc.read.user({ id: userId })).user;
  } catch {
    return notFound();
  }

  const userDetailsSanitize = {
    ...userDetails,
    date_of_birth: userDetails.date_of_birth
      ? userDetails.date_of_birth.toISOString()
      : null,
    average_selling_price: userDetails.average_selling_price
      ? userDetails.average_selling_price.toString()
      : null,
  };

  const industriesData = (await trpc.list.industries()).list;

  return (
    <AccountDetailsLMS
      sessionUserId={userData.id}
      sessionUserName={userData.full_name}
      sessionUserAvatar={
        userData.avatar ||
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/default-avatar.svg.png"
      }
      sessionUserRole={userData.role_id}
      initialData={userDetailsSanitize}
      industriesData={industriesData}
    />
  );
}
