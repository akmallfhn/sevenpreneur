"use client";

import Image from "next/image";
import Link from "next/link";

export default function CheckoutHeader() {
  return (
    <Link
      href={"/"}
      className="header flex bg-white w-full py-4 px-5 shadow-md"
    >
      <Image
        className="max-w-[160px]"
        src={
          "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//logo-sevenpreneur-main.svg"
        }
        alt="Logo Sevenpreneur"
        width={300}
        height={300}
      />
    </Link>
  );
}
