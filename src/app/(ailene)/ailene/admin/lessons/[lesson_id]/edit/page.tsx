import EditLessonAilene from "@/components/pages/EditLessonAilene";
import AppPageState from "@/components/states/AppPageState";
import { setSessionToken, trpc } from "@/trpc/server";
import { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = { title: "Edit Materi" };

interface Props {
  params: Promise<{ lesson_id: string }>;
}

export default async function EditLessonPage({ params }: Props) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;
  if (!sessionToken) return null;
  setSessionToken(sessionToken);

  const checkUser = (await trpc.auth.checkSession()).user;
  if (checkUser.role_id !== 0) return <AppPageState variant="FORBIDDEN" />;

  const { lesson_id } = await params;
  return <EditLessonAilene lessonId={Number(lesson_id)} />;
}
