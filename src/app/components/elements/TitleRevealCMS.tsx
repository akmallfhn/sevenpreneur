"use client";

interface TitleRevealCMSProps {
  titlePage: string;
  descPage: string;
}

export default function TitleRevealCMS({
  titlePage,
  descPage,
}: TitleRevealCMSProps) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="flex font-brand font-bold text-lg text-black lg:text-3xl">
        {titlePage}
      </h1>
      <p className="font-bodycopy font-medium text-sm text-alternative max-w-96">
        {descPage}
      </p>
    </div>
  );
}
