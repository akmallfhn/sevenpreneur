"use client";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { setSessionToken, trpc } from "@/trpc/client";
import { Loader2 } from "lucide-react";

interface UserBadgeCMSProps {
  sessionToken: string;
}

export default function UserBadgeCMS({ sessionToken }: UserBadgeCMSProps) {
  // Set token di awal jika ada
  useEffect(() => {
    if (sessionToken) {
      setSessionToken(sessionToken);
    }
  }, [sessionToken]);

  // --- TRPC Data
  const { data, isLoading } = trpc.auth.checkSession.useQuery(undefined, {
    enabled: !!sessionToken,
  });

  if (isLoading) {
    return (
      <div className="flex w-full h-full items-center justify-center text-alternative">
        <Loader2 className="animate-spin size-5 " />
      </div>
    );
  }

  if (!data) {
    return <div>Unauthorized</div>;
  }

  return (
    <Link
      href={"/"}
      className="user-roles-container flex w-full p-2 px-3 items-center gap-3 bg-white border border-[#E3E3E3] rounded-lg"
    >
      <div className="avatar aspect-square w-10 rounded-full overflow-hidden">
        <Image
          className="object-cover w-full h-full"
          src={
            data.user.avatar ||
            "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//default-avatar.svg.png"
          }
          alt="avatar-user"
          width={200}
          height={200}
        />
      </div>
      <div className="user-roles flex flex-col gap-0">
        <p className="user text-sm font-brand font-semibold line-clamp-1">
          {data.user.full_name}
        </p>
        <p className="roles text-xs font-bodycopy font-semibold text-alternative">
          {data.user.role_name.toUpperCase()}
        </p>
      </div>
    </Link>
  );
}
