import { MODELS } from "consts/Models";

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
  const MILLION_TOKENS = 1000_000;
  const { shortName, price } = MODELS.find(
    (model) => model.value === currentModel
  )!;

  return (
    <>
      <div className="text-gray-600 text-xs flex justify-end gap-1.5">
        <span>{shortName} -</span>
        <span>
          PT:{totalPromptTokens} - $
          {(((totalPromptTokens || 0) / MILLION_TOKENS) * price.input).toFixed(2)}
        </span>
        <span>
          CT:
          {totalCompletionTokens} - $
          {(((totalCompletionTokens || 0) / MILLION_TOKENS) * price.input).toFixed(2)}
        </span>
      </div>
    </>
  );
};
