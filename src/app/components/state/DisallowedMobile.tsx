import Image from "next/image";

export default function DisallowedMobile() {
  return (
    <div className="disallowed-mobile flex flex-col w-screen h-screen pt-24 px-6 items-center sm:pt-32 lg:hidden">
      <div className="state-attributes flex flex-col gap-4 max-w-md text-center items-center">
        <div className="state-image flex w-full max-w-64 overflow-hidden lg:max-w-80">
          <Image
            className="object-cover w-full h-full"
            src={
              "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/disallowed-mobile.svg"
            }
            alt="disallowed-mobile"
            width={400}
            height={400}
          />
        </div>
        <div className="state-text flex flex-col gap-2 items-center">
          <h2 className="state-title flex font-bold font-bodycopy text-center tracking-tight text-2xl">
            Optimized for Larger Screens
          </h2>
          <p className="state-description font-bodycopy text-center font-medium text-alternative">
            For the best learning experience, access the LMS using a device with
            a larger display like a desktop or tablet.
          </p>
        </div>
      </div>
    </div>
  );
}
