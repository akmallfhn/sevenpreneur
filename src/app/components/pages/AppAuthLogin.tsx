"use client";
import { Suspense } from "react";
import AppLoginContainer from "../elements/AppLoginContainer";
import Image from "next/image";

interface AppAuthLoginProps {
  currentDomain: string;
}

export default function AppAuthLogin({ currentDomain }: AppAuthLoginProps) {
  return (
    <div
      className={`root fixed top-0 left-0 w-screen h-screen justify-center z-50 transition-all duration-700 ease-in-out`}
    >
      <div className="relative flex w-full h-full bg-white justify-center items-start sm:items-center lg:flex-row-reverse">
        {/* Container Login & Right Side Desktop */}
        <div className="flex bg-white pt-24 sm:pt-0 lg:flex-1/2 lg:justify-center">
          <Suspense fallback={null}>
            <AppLoginContainer currentDomain={currentDomain} />
          </Suspense>
        </div>
        {/* Background Mobile & Left Side Desktop */}
        <div className="absolute flex inset-0 lg:relative lg:flex-1/2">
          {/* Logo */}
          <div className="logo hidden lg:flex lg:fixed lg:top-10 lg:left-1/4 lg:-translate-x-1/2">
            <Image
              className="max-w-64"
              src={
                "https://static.wixstatic.com/media/02a5b1_f73718a961f344cd80016aa1f5522fb6~mv2.webp"
              }
              alt="Logo Sevenpreneur"
              width={500}
              height={500}
            />
          </div>
          {/* Quotes Desktop */}
          <div className="quotes hidden lg:flex lg:absolute lg:w-max lg:top-1/2 lg:-translate-y-1/2 lg:left-1/2 lg:-translate-x-1/2">
            <p className="p-2 text-center text-4xl font-brand font-bold text-transparent bg-clip-text bg-gradient-to-br from-0% from-white/90 to-[140%] to-[#3417E3]">
              Tools for{" "}
              <span className="font-bodycopy italic underline decoration-[#7463DF]">
                scaling
              </span>
              <br />
              Frameworks for{" "}
              <span className="font-bodycopy italic underline decoration-[#7463DF]">
                thinking
              </span>
              <br />
              Space for{" "}
              <span className="font-bodycopy italic underline decoration-[#7463DF]">
                becoming
              </span>
            </p>
          </div>
          {/* Background */}
          <Image
            className="object-cover w-full h-full"
            src="https://static.wixstatic.com/media/02a5b1_e03d69c571a743c1895d874478439010~mv2.webp"
            alt="Background"
            width={1000}
            height={1000}
          />
        </div>
      </div>
    </div>
  );
}
