import Image from "next/image";
import AppButton from "../buttons/AppButton";
import Link from "next/link";

export default function ForbiddenComponent() {
  let domain = "sevenpreneur.com";
  if (process.env.NEXT_PUBLIC_DOMAIN_MODE === "local") {
    domain = "example.com:3000";
  }

  return (
    <div className="403-forbidden flex flex-col w-screen h-screen pt-24 px-6 items-center sm:pt-32 lg:px-0 lg:pt-0 lg:justify-center">
      <div className="state-attributes flex flex-col gap-4 max-w-md text-center items-center">
        <div className="state-image flex w-full max-w-64 overflow-hidden lg:max-w-80">
          <Image
            className="object-cover w-full h-full"
            src={
              "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/403-forbidden-illustration.svg"
            }
            alt="403-forbidden"
            width={500}
            height={400}
          />
        </div>
        <div className="state-text flex flex-col gap-2 items-center">
          <h2 className="state-title flex font-bold font-bodycopy text-center tracking-tight text-2xl">
            403 - Restricted Area
          </h2>
          <p className="state-description font-bodycopy text-center font-medium text-alternative">
            This page is restricted. You might not have the right permissions to
            view it.
          </p>
        </div>
        <Link href={`https://www.${domain}`}>
          <AppButton>Back to Home</AppButton>
        </Link>
      </div>
    </div>
  );
}
