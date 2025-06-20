import CohortListAndCreateCMS from "@/app/components/templates/CohortListAndCreateCMS";

export default async function CohortListPage() {
  return (
    <div className="root flex w-full h-full bg-white justify-center bg-main-root py-8 pb-24 overflow-y-auto lg:pl-64">
      <CohortListAndCreateCMS />
    </div>
  );
}
