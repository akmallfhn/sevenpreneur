import CheckoutCohortForm from "@/app/components/forms/CheckoutCohortForm";
import CheckoutHeader from "@/app/components/navigations/CheckoutHeader";
import { trpc } from "@/trpc/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface CheckoutCohortPageProps {
  params: Promise<{ cohort_name: string; cohort_id: string }>;
}

export default async function CheckoutCohortPage({
  params,
}: CheckoutCohortPageProps) {
  const { cohort_name, cohort_id } = await params;
  const cohortId = parseInt(cohort_id);
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) {
    redirect(
      `/auth/login?redirectTo=/cohort/${cohort_name}/${cohort_id}/checkout`
    );
  }

  const cohortData = (await trpc.read.cohort({ id: cohortId })).cohort;
  const ticketListRaw = (await trpc.read.cohort({ id: cohortId })).cohort
    .cohort_prices;
  const ticketList = ticketListRaw.map((item) => ({
    ...item,
    amount:
      typeof item.amount === "object" && "toNumber" in item.amount
        ? item.amount.toNumber()
        : item.amount,
  }));
  return (
    <div className="flex w-full h-full bg-section-background">
      <div className="flex flex-col bg-white max-w-md w-full mx-auto overflow-hidden">
        <CheckoutHeader />
        <CheckoutCohortForm
          cohortName={cohortData.name}
          cohortImage={cohortData.image}
          ticketListData={ticketList}
        />
      </div>
    </div>
  );
}
