"use client";
import HeroHomeSVP from "../heroes/HeroHomeSVP";
import BusinessesAlumniSVP from "../static-sections/BusinessesAlumniSVP";
import CoachesHomeSVP from "../static-sections/CoachesHomeSVP";
import CuriculumFrameworkHomeSVP from "../static-sections/CuriculumFrameworkHomeSVP";
import InstagramContentsHomeSVP from "../static-sections/InstagramContentsHomeSVP";
import ProductListSVP from "../static-sections/ProductListSVP";

export default function HomeSVP() {
  return (
    <div className="root relative items-center">
      <HeroHomeSVP />
      {/* <BusinessesAlumniSVP /> */}
      <ProductListSVP />
      <CoachesHomeSVP />
      <CuriculumFrameworkHomeSVP />
      <InstagramContentsHomeSVP />
    </div>
  );
}
