"use client";
import { Check } from "lucide-react";
import AppButton from "../buttons/AppButton";
import Link from "next/link";
import { ReactNode } from "react";
import { FeatureTrackingProps } from "@/lib/feature-tracking";
import AppCountdownTimer from "../elements/AppCountdownTimer";

interface PackageItemBlueprintProgramSVPProps extends FeatureTrackingProps {
  cohortId: number;
  cohortName: string;
  cohortSlug: string;
  packageId: number;
  packageName: string;
  packageLabel?: ReactNode;
  packageDescription: string;
  packageBenefits: ReactNode[];
  normalPrice: number;
  salePeriodPrice: number;
  isPriority?: boolean;
}

export default function PackageItemBlueprintProgramSVP({
  cohortId,
  cohortName,
  cohortSlug,
  packageId,
  packageName,
  packageLabel,
  packageDescription,
  packageBenefits,
  normalPrice,
  salePeriodPrice,
  isPriority,
  featureProductName,
  featurePosition,
}: PackageItemBlueprintProgramSVPProps) {
  return (
    <div
      className={`package-outline relative z-10 ${
        isPriority
          ? "p-1 bg-gradient-to-tr from-21% from-[#3417E3] to-100% to-[#E74D79] rounded-[12px]"
          : "p-[1px] bg-gradient-to-br from-0% from-[#C4C4C4] to-65% to-[#30266D] rounded-lg"
      }`}
    >
      <div className="package-container flex flex-col w-[312px] h-full aspect-[360/794] p-8 items-center gap-4 bg-gradient-to-b from-0% from-[#554A94] via-40% via-[#432EBA] to-100% to-[#0D063A] rounded-lg lg:w-[360px]">
        <div className="package-title flex items-center justify-center gap-3 w-full">
          <h3 className="font-bold font-brand text-white text-2xl">
            {packageName}
          </h3>
          {packageLabel}
        </div>
        <div className="divider w-full h-0.5 bg-gradient-to-r from-0% from-white/0 via-50% via-white to-100% to-white/0" />
        <p className="description font-bodycopy text-white text-[15px] text-center leading-tight">
          {packageDescription}
        </p>

        {/* Price Information */}
        <div className="price-discount flex items-center gap-2 font-brand text-white">
          <p className="discount-rate bg-secondary font-bold text-xs px-1 py-0.5 rounded-sm lg:text-sm">
            {Math.round(100 - (salePeriodPrice / normalPrice) * 100)}% OFF
          </p>
          <div className="normal-price relative flex items-center gap-0.5">
            <p className="text-[10px] font-medium text-xs lg:text-sm">Rp</p>
            <p className="font-semibold lg:text-lg">
              {normalPrice.toLocaleString("id-ID")}
            </p>
            <span className="absolute left-0 top-1/2 w-full h-[1px] bg-secondary rotate-[345deg] -translate-y-1/2" />
          </div>
        </div>
        <AppCountdownTimer
          targetDateTime={"2025-10-05T23:59:00+07:00"}
          isIncludeDimension={false}
        />
        <div className="price-after-discount flex items-center gap-0.5 font-brand text-white">
          <p className="font-bold text-lg">Rp</p>
          <p className="font-bold text-4xl">
            {salePeriodPrice.toLocaleString("id-ID")}
          </p>
        </div>

        {/* CTA Button */}
        <Link
          href={`/cohorts/${cohortSlug}/${cohortId}/checkout?ticketId=${packageId}`}
          className={`w-full ${
            isPriority
              ? "p-[1px] bg-gradient-to-b from-0% from-[#7B6FF0] to-69% to-[#4C3FEC] rounded-full"
              : ""
          }`}
        >
          <AppButton
            variant={isPriority ? "primaryGradient" : "outline"}
            size="defaultRounded"
            className="cta-button flex w-full"
            // GTM
            featureName="add_to_cart_blueprint_program"
            featureId={String(packageId)}
            featureProductCategory="COHORT"
            featureProductName={`${cohortName} - ${featureProductName}`}
            featureProductAmount={salePeriodPrice}
            featurePagePoint="Product Detail Page"
            featurePlacement="package-plan"
            featurePosition={featurePosition}
            // Meta Pixel
            metaEventName="AddToCart"
            metaContentIds={[String(packageId)]}
            metaContentType="service"
            metaContentName={`${cohortName} - ${featureProductName}`}
            metaContentCategory="Business Education Program"
            metaCurrency="IDR"
            metaValue={salePeriodPrice}
          >
            {isPriority ? "Best Value – Choose Plan" : "Purchase Now"}
          </AppButton>
        </Link>

        {/* Benefit */}
        <div className="benefits flex flex-col gap-1.5 w-full text-white">
          <h4 className="font-bodycopy font-extrabold text-[15px]">
            {isPriority
              ? "Everything in the Regular Plan plus:"
              : "Get started with:"}
          </h4>
          <div className="benefit-list flex flex-col gap-2">
            {packageBenefits.map((benefit, index) => (
              <div
                className="benefit-item flex gap-1.5 items-start"
                key={index}
              >
                <div className="benefit-check flex my-1 bg-[#018D44] rounded-[2px] shrink-0">
                  <Check color="#AFEB29" size={14} className="p-0.5" />
                </div>
                <p className="benefit-value font-bodycopy text-xs leading-snug lg:text-sm">
                  {benefit}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Badge Priority */}
      {isPriority && (
        <p className="badge-priority absolute -top-3 left-1/2 -translate-x-1/2 px-6 py-1.5 bg-secondary font-brand font-bold text-xs text-white tracking-[3px] truncate rounded-full">
          SWEET SPOT
        </p>
      )}
    </div>
  );
}
