"use client";
import { useState } from "react";
import AppButton from "../buttons/AppButton";
import InputCMS from "../fields/InputCMS";
import { DollarSign, PlusIcon, X } from "lucide-react";

export default function PriceTierStepperCMS() {
  const [tiers, setTiers] = useState([{ name: "", amount: "" }]);

  const handleAddTier = () => {
    if (tiers.length < 5) {
      setTiers([...tiers, { name: "", amount: "" }]);
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
    field: "name" | "amount",
    value: string
  ) => {
    const updatedTiers = [...tiers];
    updatedTiers[index][field] = value;
    setTiers(updatedTiers);
  };

  return (
    <div className="group-input flex flex-col gap-4">
      <h3 className="font-bold font-brand">Pricing</h3>
      {tiers.map((post, index) => (
        <div
          key={index}
          className="price-tier-item relative p-3 pb-5 bg-[#f5f5f5] flex w-full gap-4 rounded-md transform transition-all"
        >
          <div className="w-full">
            <InputCMS
              inputId="price-name"
              inputName="Tier Name"
              inputType="text"
              value={post.name}
              onInputChange={(value: string) =>
                handleChange(index, "name", value)
              }
              required
            />
          </div>
          <div className="w-full">
            <InputCMS
              inputId="price-amount"
              inputName="Set Price"
              inputType="number"
              inputIcon={
                <p className="font-bodycopy font-semibold text-sm">Rp</p>
              }
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
