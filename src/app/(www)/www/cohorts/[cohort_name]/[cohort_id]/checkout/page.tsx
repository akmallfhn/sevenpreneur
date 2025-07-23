import CheckoutCohortFormSVP from "@/app/components/forms/CheckoutCohortFormSVP";
import CheckoutHeader from "@/app/components/navigations/CheckoutHeader";
import { setSessionToken, trpc } from "@/trpc/server";
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

  // --- Redirect if not login
  if (!sessionToken) {
    redirect(
      `/auth/login?redirectTo=/cohorts/${cohort_name}/${cohort_id}/checkout`
    );
  }

  // --- Get User Data
  setSessionToken(sessionToken);
  const checkUser = (await trpc.auth.checkSession()).user;

  // --- Get Cohort Data
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

  // --- Get Payment Data
  const paymentMethodRaw = (await trpc.list.payment_channels()).list;
  const paymentMethodList = paymentMethodRaw.map((post) => ({
    ...post,
    calc_percent:
      typeof post.calc_percent === "object" && "toNumber" in post.calc_percent
        ? post.calc_percent.toNumber()
        : post.calc_percent,
    calc_flat:
      typeof post.calc_flat === "object" && "toNumber" in post.calc_flat
        ? post.calc_flat.toNumber()
        : post.calc_flat,
  }));
  return (
    <div className="flex w-full min-h-screen bg-section-background">
      <div className="flex flex-col max-w-md w-full mx-auto h-screen">
        <CheckoutHeader />
        <div className="flex-1 overflow-y-auto">
          <CheckoutCohortFormSVP
            cohortName={cohortData.name}
            cohortImage={cohortData.image}
            initialUserName={checkUser.full_name}
            initialUserEmail={checkUser.email}
            initialUserPhone={checkUser.phone_number}
            ticketListData={ticketList}
            paymentMethodData={paymentMethodList}
          />
        </div>
      </div>
    </div>
  );
}
