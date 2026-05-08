"use client";
import HeroCorporateAITrainingSVP from "@/components/heroes/HeroCorporateAITrainingSVP";
import CurriculumCorporateAITrainingSVP from "@/components/static-sections/CurriculumCorporateAITrainingSVP";
import FAQCorporateAITrainingSVP from "@/components/static-sections/FAQCorporateAITrainingSVP";
import FeaturesCorporateAITrainingSVP from "@/components/static-sections/FeaturesCorporateAITrainingSVP";
import FinalCTACorporateAITrainingSVP from "@/components/static-sections/FinalCTACorporateAITrainingSVP";
import IdealForCorporateAITrainingSVP from "@/components/static-sections/IdealForCorporateAITrainingSVP";
import ProblemCorporateAITrainingSVP from "@/components/static-sections/ProblemCorporateAITrainingSVP";
import SolutionCorporateAITrainingSVP from "@/components/static-sections/SolutionCorporateAITrainingSVP";
import MarqueeCorporateAITrainingSVP from "../static-sections/MarqueeCorporateAITrainingSVP";
import SpeakersCorporateAITrainingSVP from "../static-sections/SpeakersCorporateAITrainingSVP";
import TestimonialsCorporateAITrainingSVP from "../static-sections/TestimonialsCorporateAITrainingSVP";

export default function CorporateAITrainingSVP() {
  return (
    <div className="root relative items-center bg-black">
      <HeroCorporateAITrainingSVP />
      <MarqueeCorporateAITrainingSVP />
      <ProblemCorporateAITrainingSVP />
      <SolutionCorporateAITrainingSVP />
      <FeaturesCorporateAITrainingSVP />
      <CurriculumCorporateAITrainingSVP />
      {/* <SpeakersCorporateAITrainingSVP /> */}
      <IdealForCorporateAITrainingSVP />
      {/* <TestimonialsCorporateAITrainingSVP /> */}
      <FAQCorporateAITrainingSVP />
      <FinalCTACorporateAITrainingSVP />
    </div>
  );
}
