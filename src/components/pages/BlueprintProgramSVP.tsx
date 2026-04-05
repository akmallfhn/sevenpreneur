"use client";
import Image from "next/image";
import AppFloatingButton from "../buttons/AppFloatingButton";
import HeroBlueprintProgramSVP from "../heroes/HeroBlueprintProgramSVP";
import AboutBlueprintProgramSVP from "../static-sections/AboutBlueprintProgramSVP";
import FAQBlueprintProgramSVP from "../static-sections/FAQBlueprintProgramSVP";
import LearningListBlueprintSVP from "../static-sections/LearningListBlueprintSVP";
import OffersBlueprintProgramSVP from "../static-sections/OffersBlueprintProgramSVP";
import PriceTiersBlueprintProgramSVP, {
  PackageItem,
} from "../static-sections/PriceTiersBlueprintProgramSVP";
import ScheduleBlueprintProgramSVP from "../static-sections/ScheduleBlueprintProgramSVP";

interface BlueprintProgramSVPProps {
  cohortId: number;
  cohortName: string;
  cohortSlug: string;
  cohortPrices: PackageItem[];
}

export default function BlueprintProgramSVP(props: BlueprintProgramSVPProps) {
  return (
    <div className="root relative items-center">
      <HeroBlueprintProgramSVP
        cohortId={props.cohortId}
        cohortName={props.cohortName}
      />
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
      <AppFloatingButton
        targetURL="#package-plans"
        featureName="join_program_scroll"
        featureId={String(props.cohortId)}
        featureProductCategory="COHORT"
        featureProductName={props.cohortName}
        featurePagePoint="Product Detail Page"
        featurePlacement="floating-button"
      >
        <Image
          className="object-cover w-full h-full"
          src={
            "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/floating-button-sbbp8.webp"
          }
          alt="Actions Button"
          width={500}
          height={500}
        />
      </AppFloatingButton>
    </div>
  );
}
