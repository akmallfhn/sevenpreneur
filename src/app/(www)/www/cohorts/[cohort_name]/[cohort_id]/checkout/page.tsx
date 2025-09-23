import CheckoutCohortFormSVP from "@/app/components/forms/CheckoutCohortFormSVP";
import CheckoutHeaderSVP from "@/app/components/navigations/CheckoutHeaderSVP";
import NotFoundComponent from "@/app/components/state/404NotFound";
import { setSessionToken, trpc } from "@/trpc/server";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

interface CheckoutCohortPageProps {
  params: Promise<{ cohort_name: string; cohort_id: string }>;
}

export async function generateMetadata({
  params,
}: CheckoutCohortPageProps): Promise<Metadata> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  const { cohort_id } = await params;
  const cohortId = parseInt(cohort_id);

  // Get Data
  setSessionToken(sessionToken!);
  const cohortData = (await trpc.read.cohort({ id: cohortId })).cohort;

  return {
    title: `Checkout ${cohortData.name} - Program | Sevenpreneur`,
    description:
      "Lengkapi proses pembelian dengan aman dan cepat di halaman checkout kami. Dapatkan ringkasan pesanan dan pilih metode pembayaran terbaik.",
    authors: [{ name: "Sevenpreneur" }],
    publisher: "Sevenpreneur",
    referrer: "origin-when-cross-origin",
    alternates: {
      canonical: `/cohorts/${cohortData.slug_url}/${cohortData.id}/checkout`,
    },
    openGraph: {
      title: `Checkout ${cohortData.name} - Program | Sevenpreneur`,
      description:
        "Lengkapi proses pembelian dengan aman dan cepat di halaman checkout kami. Dapatkan ringkasan pesanan dan pilih metode pembayaran terbaik.",
      url: `/cohorts/${cohortData.slug_url}/${cohortData.id}/checkout`,
      siteName: "Sevenpreneur",
      images: [
        {
          url: cohortData.image,
          width: 800,
          height: 600,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Checkout ${cohortData.name} - Program | Sevenpreneur`,
      description:
        "Lengkapi proses pembelian dengan aman dan cepat di halaman checkout kami. Dapatkan ringkasan pesanan dan pilih metode pembayaran terbaik.",
      images: cohortData.image,
    },
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    },
  };
}

export default async function CheckoutCohortPage({
  params,
}: CheckoutCohortPageProps) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;
  const { cohort_name, cohort_id } = await params;
  const cohortId = parseInt(cohort_id);

  // Redirect if not login
  if (!sessionToken) {
    redirect(
      `/auth/login?redirectTo=/cohorts/${cohort_name}/${cohort_id}/checkout`
    );
  }

  // Get Data
  setSessionToken(sessionToken);
  const checkUser = (await trpc.auth.checkSession()).user;
  let cohortData;
  try {
    cohortData = (await trpc.read.cohort({ id: cohortId })).cohort;
  } catch (error) {
    return notFound();
  }
  const ticketListRaw = cohortData.cohort_prices;
  const ticketList = ticketListRaw.map((item) => ({
    ...item,
    amount:
      typeof item.amount === "object" && "toNumber" in item.amount
        ? item.amount.toNumber()
        : item.amount,
  }));
  const paymentMethodRaw = (await trpc.list.paymentChannels()).list;
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

  // Auto Correction Slug
  const correctSlug = cohortData.slug_url;
  if (cohort_name !== correctSlug) {
    redirect(`/cohorts/${correctSlug}/${cohortId}/checkout`);
  }

  return (
    <div className="flex w-full min-h-screen bg-section-background">
      {cohortData.cohort_prices.filter((post) => post.status === "ACTIVE")
        .length > 0 ? (
        <div className="flex flex-col max-w-md w-full mx-auto h-screen">
          <CheckoutHeaderSVP />
          <div className="flex-1 overflow-y-auto">
            <CheckoutCohortFormSVP
              cohortId={cohortData.id}
              cohortName={cohortData.name}
              cohortImage={cohortData.image}
              initialUserId={checkUser.id}
              initialUserName={checkUser.full_name}
              initialUserEmail={checkUser.email}
              initialUserPhone={checkUser.phone_number}
              ticketListData={ticketList}
              paymentMethodData={paymentMethodList}
            />
          </div>
        </div>
      ) : (
        <NotFoundComponent />
      )}
    </div>
  );
}
