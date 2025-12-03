import { AIResultPricingStrategy } from "@/trpc/routers/ai_tool/prompt.ai_tool";

export const aiToolTransformAfter = {
  AI_TOOL_ID_PRICING_STRATEGY: (result: AIResultPricingStrategy) => {
    const estimatedPrice =
      (result.total_cost.fixed_cost / result.production_per_month +
        result.total_cost.variable_cost) *
      (1 + result.prices.cost_based.margin_percentage / 100);
    return {
      ...result,
      prices: {
        ...result.prices,
        cost_based: {
          ...result.prices.cost_based,
          estimated_price: estimatedPrice,
        },
      },
    };
  },
};
