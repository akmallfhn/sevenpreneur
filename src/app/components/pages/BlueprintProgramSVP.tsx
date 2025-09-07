"use client";
import CuriculumSessionsBlueprintProgramSVP from "../templates/CuriculumSessionsBlueprintProgramSVP";
import HeroBlueprintProgramSVP from "../templates/HeroBlueprintProgramSVP";
import PackagePlansBlueprintProgramSVP, {
  PackageItem,
} from "../templates/PackagePlansBlueprintProgramSVP";

interface BlueprintProgramSVPProps {
  cohortId: number;
  cohortSlug: string;
  cohortPrices: PackageItem[];
}

export default function BlueprintProgramSVP({
  cohortId,
  cohortSlug,
  cohortPrices,
}: BlueprintProgramSVPProps) {
  return (
    <div className="root relative items-center">
      <HeroBlueprintProgramSVP />
      <CuriculumSessionsBlueprintProgramSVP />
      <PackagePlansBlueprintProgramSVP
        cohortId={cohortId}
        cohortSlug={cohortSlug}
        cohortPrices={cohortPrices}
      />
    </div>
  );
}
