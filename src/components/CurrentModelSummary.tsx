import { MODELS } from "consts/Models";
import { useFormat } from "hooks/useFormat";

type Props = {
  currentModel: string;
  totalPromptTokens?: number;
  totalCompletionTokens?: number;
};

export const CurrentModelSummary = ({
  currentModel,
  totalPromptTokens,
  totalCompletionTokens,
}: Props) => {
  const { fNumber } = useFormat();
  const MILLION_TOKENS = 1000_000;
  const { shortName, price } = MODELS.find(
    (model) => model.value === currentModel
  )!;

  return (
    <>
      <div className="text-gray-600 text-xs flex justify-end gap-1.5">
        <span>{shortName} -</span>
        <span>
          PT:{fNumber(totalPromptTokens || 0)} - $
          {(((totalPromptTokens || 0) / MILLION_TOKENS) * price.input).toFixed(2)}
        </span>
        <span>
          CT:
          {fNumber(totalCompletionTokens || 0)} - $
          {(((totalCompletionTokens || 0) / MILLION_TOKENS) * price.output).toFixed(2)}
        </span>
      </div>
    </>
  );
};
