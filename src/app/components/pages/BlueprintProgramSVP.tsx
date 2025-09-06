"use client";
import CuriculumSessionsBlueprintProgramSVP from "../templates/CuriculumSessionsBlueprintProgramSVP";
import HeroBlueprintProgramSVP from "../templates/HeroBlueprintProgramSVP";

export default function BlueprintProgramSVP() {
  return (
    <div className="root relative items-center">
      <HeroBlueprintProgramSVP />
      <CuriculumSessionsBlueprintProgramSVP />
    </div>
  );
}
