import CohortItemCardLMS from "@/app/components/items/CohortItemCardLMS";

export default function CohortsPageLMS() {
  return (
    <div className="root-page hidden w-full h-full justify-center py-8 lg:flex lg:pl-64">
      <div className="index max-w-[calc(100%-4rem)] w-full flex flex-col gap-4">
        <div className="grid gap-4 items-center lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5">
          <CohortItemCardLMS />
          <CohortItemCardLMS />
          <CohortItemCardLMS />
          <CohortItemCardLMS />
          <CohortItemCardLMS />
          <CohortItemCardLMS />
          <CohortItemCardLMS />
          <CohortItemCardLMS />
        </div>
      </div>
    </div>
  );
}
