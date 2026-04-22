import PageContainerSVP from "@/components/pages/PageContainerSVP";
import AppPageState from "@/components/states/AppPageState";

export default function NotFound() {
  return (
    <PageContainerSVP className="flex">
      <AppPageState variant="NOT_FOUND" />
    </PageContainerSVP>
  );
}
