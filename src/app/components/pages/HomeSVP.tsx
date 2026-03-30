"use client";
import HeroHomeSVP from "../heroes/HeroHomeSVP";
import BusinessesAlumniHomeSVP from "../static-sections/BusinessesAlumniHomeSVP";
import CoachesHomeSVP from "../static-sections/CoachesHomeSVP";
import CuriculumFrameworkHomeSVP from "../static-sections/CuriculumFrameworkHomeSVP";
import InstagramContentsHomeSVP from "../static-sections/InstagramContentsHomeSVP";
import ProductsHomeSVP from "../static-sections/ProductsHomeSVP";

export default function HomeSVP() {
  return (
    <div className="root relative items-center">
      <HeroHomeSVP />
      <BusinessesAlumniHomeSVP />
      <ProductsHomeSVP />
      <CoachesHomeSVP />
      <CuriculumFrameworkHomeSVP />
      <InstagramContentsHomeSVP />
    </div>
  );
}
