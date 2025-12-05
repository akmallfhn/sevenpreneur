import { CostListForm } from "@/app/components/stepper/AICostListStepperLMS";

export function findIncompleteCosts(costs: CostListForm[]) {
  return costs.filter((c) => {
    const name = c.name?.trim() || "";
    const quantity = c.quantity?.trim() || "";
    const unit = c.unit?.trim() || "";
    const total = c.total_cost?.trim() || "";

    const hasAny = name || quantity || unit || total;
    const isComplete = name && quantity && unit && total;

    return hasAny && !isComplete;
  });
}
