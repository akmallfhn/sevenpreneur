"use client";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CheckoutHeaderSVP() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <div className="header sticky w-full top-0 left-0 flex bg-white py-4 px-5 shadow-md z-50 dark:bg-surface-black">
      <Link href={"/"}>
        {mounted && (
          <Image
            className="max-w-[148px]"
            src={
              theme === "dark"
                ? "https://static.wixstatic.com/media/02a5b1_f73718a961f344cd80016aa1f5522fb6~mv2.webp"
                : "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//logo-sevenpreneur-main.svg"
            }
            alt="Logo Sevenpreneur"
            width={300}
            height={300}
          />
        )}
      </Link>
    </div>
  );
}
