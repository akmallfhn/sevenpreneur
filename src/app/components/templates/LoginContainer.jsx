"use client";
import { useGoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AppButton from "../elements/AppButton";
import Link from "next/link";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function LoginContainer({ currentDomain }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // --- Return token from Google
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsLoading(true);
        // --- Sent request to route handler
        const response = await fetch(
          `https://www.${currentDomain}/api/auth/callback/google`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tokenResponse }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to trigger route");
        }

        // --- Return response from route.js
        const result = await response.json();
        console.log("Response from route handler:", result);

        // --- Redirect and status message
        if (result.status === 200) {
          setIsLoading(false);
          router.push(`https://admin.${currentDomain}`);
        } else {
        }
      } catch (error) {
        console.error("Login failed:", error);
      }
    },
  });

  return (
    <div className="container flex z-30 py-14 px-6 max-w-[336px] items-center bg-white/30 rounded-[20px] backdrop-blur-xl lg:max-w-[420px]">
      <div className="login-component flex flex-col mx-auto gap-8 text-white items-center text-center lg:text-black">
        <Image
          className="flex max-w-[90px] lg:hidden"
          src={
            "https://static.wixstatic.com/media/02a5b1_66724615f4b947cfbdd68d48775ec024~mv2.webp"
          }
          alt="Logo Sevenpreneur"
          width={300}
          height={400}
        />
        <Image
          className="hidden max-w-[140px] lg:flex"
          src={
            "https://static.wixstatic.com/media/02a5b1_37f72798de574a0eac1c827c176225a0~mv2.webp"
          }
          alt="Logo Sevenpreneur"
          width={300}
          height={400}
        />
        <div className="login-head flex flex-col font-ui gap-2">
          <h1 className="login-title text-xl font-bold lg:text-2xl">
            Welcome Back, Founder!
          </h1>
          <p className="login-tagline lg:text-lg lg:text-alternative">
            Log in. Level up. Scale.
          </p>
        </div>
        <div className="login-action flex flex-col font-ui gap-2 w-full">
          <p className="text-[13px] lg:text-base lg:text-alternative">
            Login faster with
          </p>

          {/* Google Login */}
          <AppButton
            variant="outline"
            onClick={() => login()}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="size-5 animate-spin text-alternative" />
            ) : (
              <Image
                className="flex size-6"
                src={
                  "https://www.gstatic.com/marketing-cms/assets/images/d5/dc/cfe9ce8b4425b410b49b7f2dd3f3/g.webp=s96-fcrop64=1,00000000ffffffff-rw"
                }
                alt="Logo Google"
                width={100}
                height={100}
              />
            )}

            <p className="font-bold">Login with Google</p>
          </AppButton>
        </div>
        <p className="font-ui text-[11px] lg:text-sm">
          By logging in, you agree to Sevenpreneur’s {""}
          <Link
            href={"/privacy-policy"}
            className="font-extrabold text-secondary underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </Link>
          {""} and {""}
          <Link
            href={"/terms-conditions"}
            className="font-extrabold text-secondary underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms & Conditions
          </Link>
        </p>
      </div>
    </div>
  );
}
