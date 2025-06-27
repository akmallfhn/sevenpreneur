import Image from "next/image";

export default function DisallowedMobile() {
  return (
    <div className="disallowed-mobile flex flex-col max-w-md mx-auto pt-24 px-6 gap-4 items-center sm:pt-32 lg:hidden">
      <div className="flex max-w-80 overflow-hidden">
        <Image
          className="object-cover w-full h-full"
          src={
            "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//disallowed-mobile-illustration%20(1).webp"
          }
          alt="disallowed-mobile"
          width={400}
          height={400}
        />
      </div>
      <h2 className="flex font-bold font-brand text-center tracking-tight text-2xl text-neutral-black">
        Optimized for Larger Screens
      </h2>
      <p className="font-bodycopy text-center font-medium text-alternative">
        <span className="text-black ">admin.sevenpreneur.com</span> is designed
        for wider screens. Please switch to a desktop or rotate your device.
      </p>
    </div>
  );
}
