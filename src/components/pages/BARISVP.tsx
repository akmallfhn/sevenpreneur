import HeroBARISVP from "@/components/heroes/HeroBARISVP";
import FinalCTABARISVP from "@/components/static-sections/FinalCTABARISVP";
import HowItWorksBARISVP from "@/components/static-sections/HowItWorksBARISVP";
import MeasuresBARISVP from "@/components/static-sections/MeasuresBARISVP";
import ReportContentsBARISVP from "@/components/static-sections/ReportContentsBARISVP";
import TiersBARISVP from "@/components/static-sections/TiersBARISVP";

export default function BARISVP() {
  return (
    <div className="relative" style={{ background: "#0a0908" }}>
      <HeroBARISVP />
      <MeasuresBARISVP />
      <HowItWorksBARISVP />
      <ReportContentsBARISVP />
      <TiersBARISVP />
      <FinalCTABARISVP />
    </div>
  );
}
