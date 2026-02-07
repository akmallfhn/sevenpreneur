"use client";
import { StatusType } from "@/lib/app-types";
import AppButton from "../buttons/AppButton";
import InputCMS from "../fields/InputCMS";
import { PlusIcon, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import StatusLabelCMS from "../labels/StatusLabelCMS";
import InputNumberCMS from "../fields/InputNumberCMS";

export interface PriceTier {
  id?: number;
  name: string;
  amount: string;
  status: StatusType;
}

interface PriceTierStepperCMSProps {
  tiers: PriceTier[];
  setTiers: (tiers: PriceTier[]) => void;
}

export default function PriceTierStepperCMS({
  tiers,
  setTiers,
}: PriceTierStepperCMSProps) {
  const handleAddTier = () => {
    if (tiers.length < 5) {
      setTiers([...tiers, { name: "", amount: "", status: "ACTIVE" }]);
    }
  };

  const handleRemoveTier = (indexToRemove: number) => {
    if (tiers.length > 1) {
      const updated = tiers.filter((_, i) => i !== indexToRemove);
      setTiers(updated);
    }
  };

  const handleChange = (
    index: number,
    field: "name" | "amount" | "status",
    value: string | StatusType,
  ) => {
    const updatedTiers = [...tiers]; // 1. Create copy for tiers
    updatedTiers[index] = { ...updatedTiers[index], [field]: value }; // 2. Update value
    setTiers(updatedTiers); // 3. Update state with in Array
  };

  return (
    <div className="group-input flex flex-col gap-4">
      <div className="flex flex-col">
        <h3 className="section-title font-bold font-brand">Prices</h3>
        <p className="section-desc font-bodycopy font-medium text-sm text-alternative">
          Max. 5 price tiers allowed
        </p>
      </div>
      {tiers.map((post, index) => (
        <div
          key={index}
          className="price-tier-item relative flex flex-col w-full p-3 pb-5 bg-section-background/50 border border-outline gap-4 rounded-md transform transition-all"
        >
          <div className="flex gap-4">
            <div className="price-name w-full">
              <InputCMS
                inputId="price-name"
                inputName="Price Tier"
                inputType="text"
                inputPlaceholder="e.g. Reguler"
                value={post.name}
                onInputChange={(value: string) =>
                  handleChange(index, "name", value)
                }
                required
              />
            </div>
            <div className="price-amount w-full">
              <InputNumberCMS
                inputId="price-amount"
                inputName="Amount"
                inputConfig="numeric"
                inputPlaceholder="100000"
                inputIcon="Rp"
                value={post.amount}
                onInputChange={(value: string) =>
                  handleChange(index, "amount", value)
                }
                required
              />
              {tiers.length > 1 && (
                <button
                  className="remove-tier absolute -top-2 -right-2 p-1 bg-black/10 cursor-pointer rounded-full"
                  type="button"
                  onClick={() => handleRemoveTier(index)}
                >
                  <X className="size-3 text-black" />
                </button>
              )}
            </div>
          </div>
          <div className="price-status flex flex-col gap-1">
            <label
              htmlFor="price-status"
              className="flex pl-1 gap-0.5 text-sm text-black font-bodycopy font-semibold"
            >
              Status <span className="text-red-700">*</span>
            </label>
            <div className="switch-button flex pl-1 gap-2">
              <Switch
                className="data-[state=checked]:bg-cms-primary"
                checked={post.status === "ACTIVE"}
                onCheckedChange={(checked) =>
                  handleChange(index, "status", checked ? "ACTIVE" : "INACTIVE")
                }
              />
              {post.status && <StatusLabelCMS variants={post.status} />}
            </div>
          </div>
        </div>
      ))}
      {tiers.length < 5 && (
        <AppButton
          size="small"
          variant="cmsPrimaryLight"
          type="button"
          onClick={handleAddTier}
        >
          <PlusIcon className="size-4" />
          Add price tier
        </AppButton>
      )}
    </div>
  );
}
