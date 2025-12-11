"use client";
import AppButton from "../buttons/AppButton";
import { PlusIcon, X } from "lucide-react";
import InputNumberSVP from "../fields/InputNumberSVP";
import InputSVP from "../fields/InputSVP";
import { useEffect } from "react";

export interface CostListForm {
  name: string;
  quantity: string;
  unit: string;
  total_cost: string;
}

interface AICostListStepperLMSProps {
  costs: CostListForm[];
  setCosts: React.Dispatch<React.SetStateAction<CostListForm[]>>;
}

export default function AICostListStepperLMS(props: AICostListStepperLMSProps) {
  // View minimal 1 row
  useEffect(() => {
    if (props.costs.length === 0) {
      props.setCosts([{ name: "", quantity: "", unit: "", total_cost: "" }]);
    }
  }, [props]);

  const handleAddTier = () => {
    props.setCosts((prev) => [
      ...prev,
      { name: "", quantity: "", unit: "", total_cost: "" },
    ]);
  };

  const handleRemoveTier = (indexToRemove: number) => {
    props.setCosts((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const handleChange = (
    index: number,
    field: "name" | "quantity" | "unit" | "total_cost",
    value: string
  ) => {
    props.setCosts((prev) => {
      const updated = [...prev];

      updated[index] = {
        ...updated[index],
        [field]: value,
      };

      return updated;
    });
  };

  return (
    <div className="cost-list flex flex-col gap-2 bg-section-background p-3 border rounded-md transform transition-all">
      <div className="cost-header flex w-full gap-2 items-center">
        <p className="font-bodycopy text-[#111111]/60 font-medium text-[15px] w-full flex-3">
          Nama Biaya
        </p>
        <p className="font-bodycopy text-[#111111]/60 font-medium text-[15px] w-full flex-1">
          Kuantitas
        </p>
        <p className="font-bodycopy text-[#111111]/60 font-medium text-[15px] w-full flex-1">
          Unit
        </p>
        <p className="font-bodycopy text-[#111111]/60 font-medium text-[15px] w-full flex-2">
          Harga
        </p>
      </div>
      {props.costs.map((post, index) => (
        <div
          key={index}
          className="cost-item relative flex items-center w-full gap-2"
        >
          <div className="w-full flex-3">
            <InputSVP
              inputId="cost-name"
              inputType="text"
              inputPlaceholder="Nama Bahan/Komponen"
              value={post.name}
              onInputChange={(value: string) =>
                handleChange(index, "name", value)
              }
            />
          </div>
          <div className="w-full flex-1">
            <InputNumberSVP
              inputId="cost-quantity"
              inputPlaceholder="Jumlah"
              inputConfig="decimal"
              value={post.quantity}
              onInputChange={(value: string) =>
                handleChange(index, "quantity", value)
              }
            />
          </div>
          <div className="w-full flex-1">
            <InputSVP
              inputId="cost-unit"
              inputType="text"
              inputPlaceholder="Unit"
              value={post.unit}
              onInputChange={(value: string) =>
                handleChange(index, "unit", value)
              }
            />
          </div>
          <div className="w-full flex-2">
            <InputNumberSVP
              inputId="cost-price"
              inputPlaceholder="Harga"
              inputConfig="numeric"
              value={post.total_cost}
              onInputChange={(value: string) =>
                handleChange(index, "total_cost", value)
              }
            />
          </div>
          {props.costs.length > 1 && (
            <button
              className="remove-item absolute -top-2 -right-2 p-0.5 bg-semi-destructive cursor-pointer rounded-full"
              type="button"
              onClick={() => handleRemoveTier(index)}
            >
              <X className="size-3 text-destructive" />
            </button>
          )}
        </div>
      ))}
      <AppButton
        size="small"
        variant="cmsPrimaryLight"
        type="button"
        onClick={handleAddTier}
      >
        <PlusIcon className="size-4" />
        Tambah Item Biaya
      </AppButton>
    </div>
  );
}
