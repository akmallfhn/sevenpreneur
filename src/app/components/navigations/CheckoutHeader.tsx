"use client";

import Image from "next/image";
import Link from "next/link";

export default function CheckoutHeader() {
  return (
    <div className="header sticky w-full top-0 left-0 flex bg-white py-4 px-5 shadow-md z-50">
      <Link href={"/"}>
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
    </div>
  );
}
