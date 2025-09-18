import { MODELS } from "core/const/Models";

export const useCurrentChatMetadata = (modelName: string) => {
  const lookupModelPrice = () => {
    if (!modelName) return undefined;
    const model = MODELS.find((m) => m.name === modelName);
    return model?.price;
  };

  const calculatePromptTokens = (totalPromptTokens: number) => {
    const modelPrice = lookupModelPrice();
    return modelPrice && typeof totalPromptTokens === "number"
      ? (totalPromptTokens / 1_000_000) * modelPrice.input
      : undefined;
  };

  const calculateCompletionTokens = (totalCompletionTokens: number) => {
    const modelPrice = lookupModelPrice();
    return modelPrice && typeof totalCompletionTokens === "number"
      ? (totalCompletionTokens / 1_000_000) * modelPrice.output
      : undefined;
  };

  const formatCost = (cost?: number) => {
    if (cost === undefined || Number.isNaN(cost)) return "-";
    try {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 3,
      }).format(cost);
    } catch {
      return `$${cost.toFixed(3)}`;
    }
  };
  return { formatCost, calculatePromptTokens, calculateCompletionTokens };
};
