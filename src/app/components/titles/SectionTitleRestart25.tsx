"use client";

interface SectionTitleRestart25Props {
  sectionTitle: string;
}

export default function SectionTitleRestart25({
  sectionTitle,
}: SectionTitleRestart25Props) {
  return (
    <h2 className="title-content w-fit font-bold text-2xl font-brand text-center text-transparent bg-clip-text bg-gradient-to-r from-[#D1CDCD] via-[#696868] to-[#D1CDCD] lg:text-[42px]">
      {sectionTitle}
    </h2>
  );
}
