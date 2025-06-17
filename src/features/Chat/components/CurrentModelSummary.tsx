import { MODELS } from "consts/Models";
import { useFormat } from "hooks/useFormat";
import { useCurrentChatStoreGetCurrentModelData } from "store/features/chat/useCurrentChatStore";

export const CurrentModelSummary = () => {
  const currentModel = useCurrentChatStoreGetCurrentModelData();
  const { fNumber } = useFormat();
  if (!currentModel) return null;
  const MILLION_TOKENS = 1000_000;
  const { shortName, price } = MODELS.find(
    (m) => m.value === currentModel?.model
  )!;

  return (
    <div className="text-gray-400 text-xs flex flex-col md:flex-row justify-end md:justify-center items-center md:items-end gap-1.5 mt-0.5">
      <p>
        {shortName} <span className="hidden md:inline">-</span>{" "}
      </p>
      <div className="flex gap-1">
        <span>
          PT:{fNumber(currentModel?.totalPromptTokens || 0)} - $
          {(
            ((currentModel?.totalPromptTokens || 0) / MILLION_TOKENS) *
            price.input
          ).toFixed(2)}
        </span>
        <span>
          CT:
          {fNumber(currentModel?.totalCompletionTokens || 0)} - $
          {(
            ((currentModel?.totalCompletionTokens || 0) / MILLION_TOKENS) *
            price.output
          ).toFixed(2)}
        </span>
      </div>
    </div>
  );
};
