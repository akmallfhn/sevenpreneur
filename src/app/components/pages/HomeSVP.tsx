"use client";
import HeroHomeSVP from "../heroes/HeroHomeSVP";
import CoachEducatorListSVP from "../static-sections/CoachEducatorListSVP";

export default function HomeSVP() {
  return (
    <div className="root relative items-center">
      <HeroHomeSVP />
      <CoachEducatorListSVP />
    </div>
  );
}
