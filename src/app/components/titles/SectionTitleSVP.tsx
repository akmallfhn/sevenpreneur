"use client";

interface SectionTitleSVPProps {
  sectionTitle: string;
  sectionDescription?: string;
}

export default function SectionTitleSVP({
  sectionTitle,
  sectionDescription,
}: SectionTitleSVPProps) {
  return (
    <div className="section-title-group flex flex-col gap-2">
      <div className="section-title-container flex flex-col">
        <h2 className="section-title font-brand font-bold text-xl lg:text-[21px]">
          {sectionTitle}
        </h2>
        {sectionDescription && (
          <p className="section-description text-sm text-alternative lg:text-base">
            {sectionDescription}
          </p>
        )}
      </div>
      <hr />
    </div>
  );
}
