"use client";
import HeroHomeSVP from "../heroes/HeroHomeSVP";
import CoachEducatorListSVP from "../static-sections/CoachEducatorListSVP";
import InstagramTypeContentSVP from "../static-sections/InstagramTypeContentSVP";
import ProductListSVP from "../static-sections/ProductListSVP";

export default function HomeSVP() {
  return (
    <div className="root relative items-center">
      <HeroHomeSVP />
      <ProductListSVP />
      {/* <BusinessesAlumniSVP /> */}
      <CoachEducatorListSVP />
      <InstagramTypeContentSVP />
    </div>
  );
}
