"use client";
import HeroBlueprintProgramSVP from "../heroes/HeroBlueprintProgramSVP";
import BatchScheduleBlueprintProgramSVP from "../templates/BatchScheduleBlueprintProgramSVP";
import FAQCustomerBlueprintProgramSVP from "../templates/FAQCustomerBlueprintProgramSVP";
import LearningListBlueprintSVP from "../templates/LearningListBlueprintSVP";
import OfferHighlightBlueprintProgramSVP from "../templates/OfferHighlightBlueprintProgramSVP";
import OverviewBlueprintProgramSVP from "../templates/OverviewBlueprintProgramSVP";
import PriceTiersBlueprintProgramSVP, {
  PackageItem,
} from "../templates/PriceTiersBlueprintProgramSVP";

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
      <LearningListBlueprintSVP />
      <PriceTiersBlueprintProgramSVP
        cohortId={cohortId}
        cohortName={cohortName}
        cohortSlug={cohortSlug}
        cohortPrices={cohortPrices}
      />
      <FAQCustomerBlueprintProgramSVP cohortId={cohortId} />
    </div>
  );
}
