"use client";
import BatchScheduleBlueprintProgramSVP from "../templates/BatchScheduleBlueprintProgramSVP";
import CuriculumSessionsBlueprintProgramSVP from "../templates/CuriculumSessionsBlueprintProgramSVP";
import FAQCustomerBlueprintProgramSVP from "../templates/FAQCustomerBlueprintProgramSVP";
import HeroBlueprintProgramSVP from "../templates/HeroBlueprintProgramSVP";
import OfferHighlightBlueprintProgramSVP from "../templates/OfferHighlightBlueprintProgramSVP";
import OverviewBlueprintProgramSVP from "../templates/OverviewBlueprintProgramSVP";
import PackagePlansBlueprintProgramSVP, {
  PackageItem,
} from "../templates/PackagePlansBlueprintProgramSVP";

interface BlueprintProgramSVPProps {
  cohortId: number;
  cohortName: string;
  cohortSlug: string;
  cohortPrices: PackageItem[];
}

export default function BlueprintProgramSVP({
  cohortId,
  cohortName,
  cohortSlug,
  cohortPrices,
}: BlueprintProgramSVPProps) {
  return (
    <div className="root relative items-center">
      <HeroBlueprintProgramSVP cohortId={cohortId} />
      <OverviewBlueprintProgramSVP />
      <OfferHighlightBlueprintProgramSVP />
      <BatchScheduleBlueprintProgramSVP />
      <CuriculumSessionsBlueprintProgramSVP />
      <PackagePlansBlueprintProgramSVP
        cohortId={cohortId}
        cohortName={cohortName}
        cohortSlug={cohortSlug}
        cohortPrices={cohortPrices}
      />
      <FAQCustomerBlueprintProgramSVP cohortId={cohortId} />
    </div>
  );
}
