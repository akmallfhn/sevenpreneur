import LoadingStateLMS from "@/app/components/states/LoadingStateLMS";

export default function Loading() {
  return (
    <div className="flex items-center justify-center w-full h-full pt-40 px-6 sm:pt-44 lg:px-0 lg:pt-0 lg:h-screen lg:pl-64">
      <LoadingStateLMS />
    </div>
  );
}
