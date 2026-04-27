import SessionDetailAilene from "@/components/pages/SessionDetailAilene";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Session Detail" };

interface Props {
  params: Promise<{ session_id: string }>;
}

export default async function SessionDetailPage({ params }: Props) {
  const { session_id } = await params;
  return <SessionDetailAilene sessionId={Number(session_id)} />;
}
