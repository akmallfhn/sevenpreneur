import Image from "next/image";
import AppButton from "../buttons/AppButton";
import Link from "next/link";

export default function NotFoundComponent() {
  return (
    <div className="404-not-found flex flex-col w-screen h-screen pt-24 px-6 items-center sm:pt-32 lg:px-0 lg:pt-0 lg:justify-center">
      <div className="flex flex-col gap-4 max-w-md text-center items-center">
        <div className="flex max-w-80 overflow-hidden">
          <Image
            className="object-cover w-full h-full"
            src={
              "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//404-not-found.webp"
            }
            alt="404-not-found"
            width={500}
            height={400}
          />
        </div>
        <h2 className="flex font-bold font-brand text-center tracking-tight text-2xl text-neutral-black">
          404 - Nothing to see here
        </h2>
        <p className="font-bodycopy text-center font-medium text-alternative">
          Sorry, the page you’re looking for doesn’t exist or may have been
          moved.
        </p>
        <Link href={"/"}>
          <AppButton>Back to Home</AppButton>
        </Link>
      </div>
    </div>
  );
}
