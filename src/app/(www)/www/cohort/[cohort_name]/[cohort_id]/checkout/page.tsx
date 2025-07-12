import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface CheckoutCohortPageProps {
  params: Promise<{ cohort_name: string; cohort_id: string }>;
}

export default async function CheckoutCohortPage({
  params,
}: CheckoutCohortPageProps) {
  const { cohort_name, cohort_id } = await params;
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) {
    redirect(
      `/auth/login?redirectTo=/cohort/${cohort_name}/${cohort_id}/checkout`
    );
  }
  return <div className="w-full h-[700px]">This is checkout Page</div>;
}
