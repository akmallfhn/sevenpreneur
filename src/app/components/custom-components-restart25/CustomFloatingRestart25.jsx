"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function CustomFloatingRestart25() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed max-w-[160px] w-full bottom-16 right-5 z-[80] transition transform ease-in-out active:scale-95 md:max-w-[220px] md:bottom-7 md:right-7 ${
        showButton
          ? "opacity-100 pointer-events-auto translate-x-0 duration-500"
          : "opacity-0 pointer-events-none translate-x-full duration-300"
      }`}
    >
      <Link href={"#ticket-id"}>
        <Image
          className="object-cover w-full h-full"
          src={
            "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//button-buy-v2.webp"
          }
          alt="Actions Button"
          width={500}
          height={500}
        />
      </Link>
    </div>
  );
}
