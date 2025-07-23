import { trpc } from "@/trpc/server";
import Image from "next/image";

export default async function AdminHomePage() {
  const sessionUser = (await trpc.auth.checkSession()).user;

  return (
    <div className="root hidden w-full h-full justify-center bg-white py-8 overflow-y-auto lg:flex lg:pl-64">
      <div className="container max-w-[calc(100%-4rem)] w-full flex flex-col gap-5">
        <div className="container-leaderboard-learning relative flex w-full items-center aspect-panorama-leaderboard rounded-lg overflow-hidden">
          {/* Metadata */}
          <div className="metadata-leaderboard-learning flex flex-col pl-8 gap-1 z-10 ">
            <h1 className="font-brand font-bold text-2xl text-white">
              Hello, {sessionUser.full_name}
            </h1>
            <h1 className="font-bodycopy font-bold text-xl text-white">
              Welcome to Content Management System of Sevenpreneur
            </h1>
          </div>
          {/* Background */}
          <Image
            className="object-cover w-full h-full"
            src={
              "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//hello-dashboard.webp"
            }
            alt="Header"
            fill
          />
        </div>
      </div>
    </div>
  );
}
