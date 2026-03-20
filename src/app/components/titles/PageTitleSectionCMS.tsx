"use client";

interface PageTitleSectionCMSProps {
  pageTitle: string;
  pageDesc?: string;
}

export default function PageTitleSectionCMS(props: PageTitleSectionCMSProps) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="flex font-brand font-bold text-lg text-black lg:text-3xl">
        {props.pageTitle}
      </h1>
      {props.pageDesc && (
        <p className="font-bodycopy font-medium text-sm text-alternative max-w-96">
          {props.pageDesc}
        </p>
      )}
    </div>
  );
}
