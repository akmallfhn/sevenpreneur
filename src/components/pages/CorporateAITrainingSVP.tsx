import CurriculumCorporateAITrainingSVP from "@/components/static-sections/CurriculumCorporateAITrainingSVP";
import FAQCorporateAITrainingSVP from "@/components/static-sections/FAQCorporateAITrainingSVP";
import FeaturesCorporateAITrainingSVP from "@/components/static-sections/FeaturesCorporateAITrainingSVP";
import FinalCTACorporateAITrainingSVP from "@/components/static-sections/FinalCTACorporateAITrainingSVP";
import HeroCorporateAITrainingSVP from "@/components/heroes/HeroCorporateAITrainingSVP";
import IdealForCorporateAITrainingSVP from "@/components/static-sections/IdealForCorporateAITrainingSVP";
import ProblemCorporateAITrainingSVP from "@/components/static-sections/ProblemCorporateAITrainingSVP";
import SolutionCorporateAITrainingSVP from "@/components/static-sections/SolutionCorporateAITrainingSVP";

export default function CorporateAITrainingSVP() {
  return (
    <div className="relative">
      <HeroCorporateAITrainingSVP />
      {/* <MarqueeCorporateAITrainingSVP /> */}
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
