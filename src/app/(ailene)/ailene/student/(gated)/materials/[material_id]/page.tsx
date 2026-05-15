import MaterialDetailsAILN from "@/components/pages/MaterialDetailsAILN";
import AppPageState from "@/components/states/AppPageState";
import { setSessionToken, trpc } from "@/trpc/server";
import { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Materi",
};

export default async function MaterialPage({
  params,
}: {
  params: Promise<{ material_id: string }>;
}) {
  const { material_id: materialId } = await params;

  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;
  if (!sessionToken) return null;
  setSessionToken(sessionToken);

  if (!materialId) {
    return <AppPageState variant="NOT_FOUND" />;
  }

  const ailMember = (await trpc.auth.checkAilMember()).ail_member;
  if (
    !ailMember ||
    (ailMember.role !== "STUDENT" && ailMember.role !== "CHAMPION")
  ) {
    return <AppPageState variant="FORBIDDEN" />;
  }

  return (
    <MaterialDetailsAILN sessionToken={sessionToken} materialId={materialId} />
  );
}
