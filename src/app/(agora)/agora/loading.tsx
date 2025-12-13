import LoadingStateLMS from "@/app/components/states/LoadingStateLMS";

export default function Loading() {
  return (
    <div className="flex w-full justify-center pt-40 px-6 overflow-hidden sm:pt-44 lg:items-center lg:px-0 lg:pt-0 lg:h-screen lg:pl-64">
      <LoadingStateLMS />
    </div>
  );
}
