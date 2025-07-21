import AppButton from "@/app/components/buttons/AppButton";
import HeaderNavbarSVP from "@/app/components/navigations/HeaderNavbarSVP";
import { setSecretKey, setSessionToken, trpc } from "@/trpc/server";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

interface CohortDetailsPageProps {
  params: Promise<{ cohort_name: string; cohort_id: string }>;
}

export default async function CohortDetailsPage({
  params,
}: CohortDetailsPageProps) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;
  if (!sessionToken) return null;
  const secretKey = process.env.SECRET_KEY_PUBLIC_API;

  const { cohort_name, cohort_id } = await params;
  const cohortId = parseInt(cohort_id);

  // --- Check User Session
  let userData:
    | Awaited<ReturnType<typeof trpc.auth.checkSession>>["user"]
    | null = null;
  if (sessionToken) {
    setSessionToken(sessionToken);
    const checkUser = await trpc.auth.checkSession();
    userData = checkUser.user;
  }

  // --- Checking Access
  setSessionToken(sessionToken);
  const checkUser = (await trpc.auth.checkSession()).user;
  if (checkUser.role_id !== 0) {
    return notFound();
  }

  // --- Get Data
  setSecretKey(secretKey!);
  const cohortDetails = await trpc.read.cohort({ id: cohortId });
  const data = cohortDetails.cohort;

  return (
    <React.Fragment>
      <HeaderNavbarSVP
        userAvatar={userData?.avatar ?? null}
        userRole={userData?.role_id}
        isLoggedIn={!!userData}
      />

      {/* Beli */}
      <div className="w-full h-[700px] font-ui justify-center pt-[160px]">
        <div className="flex flex-col max-w-[620px] mx-auto items-center lg:flex-row">
          <div className="flex flex-col items-center gap-4 lg:flex-row">
            <div className="aspect-square w-[100px] rounded-md overflow-hidden">
              <Image
                className="object-cover w-full h-full"
                src={data.image}
                alt={data.name}
                width={300}
                height={300}
              />
            </div>
            <div className="flex flex-col text-center max-w-[420px] lg:text-left">
              <h1 className="font-bold">{data.name}</h1>
              <p>{data.description}</p>
            </div>
          </div>
          <Link href={`/cohorts/${cohort_name}/${cohort_id}/checkout`}>
            <AppButton>Beli Kelas Ini</AppButton>
          </Link>
        </div>
      </div>
    </React.Fragment>
  );
}
