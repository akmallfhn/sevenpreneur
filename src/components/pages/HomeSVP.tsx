"use client";
import HeroHomeSVP from "../../app/components/heroes/HeroHomeSVP";
import BusinessesAlumniHomeSVP from "../../app/components/static-sections/BusinessesAlumniHomeSVP";
import CoachesHomeSVP from "../../app/components/static-sections/CoachesHomeSVP";
import CuriculumFrameworkHomeSVP from "../../app/components/static-sections/CuriculumFrameworkHomeSVP";
import InstagramContentsHomeSVP from "../../app/components/static-sections/InstagramContentsHomeSVP";
import ProductsHomeSVP from "../../app/components/static-sections/ProductsHomeSVP";

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
