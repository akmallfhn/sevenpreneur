"use client";
import HeroHomeSVP from "../heroes/HeroHomeSVP";
import BusinessesAlumniSVP from "../static-sections/BusinessesAlumniSVP";
import CoachEducatorListSVP from "../static-sections/CoachEducatorListSVP";
import ProductListSVP from "../static-sections/ProductListSVP";

export default function HomeSVP() {
  return (
    <div className="root relative items-center">
      <HeroHomeSVP />
      <ProductListSVP />
      {/* <BusinessesAlumniSVP /> */}
      <CoachEducatorListSVP />
    </div>
  );
}
