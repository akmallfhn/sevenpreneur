"use client";
import HeroBlueprintProgramSVP from "../heroes/HeroBlueprintProgramSVP";
import AboutBlueprintProgramSVP from "../static-sections/AboutBlueprintProgramSVP";
import FAQBlueprintProgramSVP from "../static-sections/FAQBlueprintProgramSVP";
import LearningListBlueprintSVP from "../static-sections/LearningListBlueprintSVP";
import PriceTiersBlueprintProgramSVP, {
  PackageItem,
} from "../static-sections/PriceTiersBlueprintProgramSVP";
import ScheduleBlueprintProgramSVP from "../static-sections/ScheduleBlueprintProgramSVP";
import OffersBlueprintProgramSVP from "../static-sections/OffersBlueprintProgramSVP";

interface BlueprintProgramSVPProps {
  cohortId: number;
  cohortName: string;
  cohortSlug: string;
  cohortPrices: PackageItem[];
}

export default function BlueprintProgramSVP(props: BlueprintProgramSVPProps) {
  return (
    <div className="root relative items-center">
      <HeroBlueprintProgramSVP cohortId={props.cohortId} />
      <AboutBlueprintProgramSVP />
      <OffersBlueprintProgramSVP />
      <ScheduleBlueprintProgramSVP />
      <LearningListBlueprintSVP />
      <PriceTiersBlueprintProgramSVP
        cohortId={props.cohortId}
        cohortName={props.cohortName}
        cohortSlug={props.cohortSlug}
        cohortPrices={props.cohortPrices}
      />
      <FAQBlueprintProgramSVP cohortId={props.cohortId} />
    </div>
  );
}
