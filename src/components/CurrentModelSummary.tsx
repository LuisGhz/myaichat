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

  const model = MODELS.find((model) => model.value === currentModel)?.name || currentModel;

  return (
    <>
      <div className="text-gray-700 text-xs flex justify-end gap-1.5 mb-1">
        <span>Model: {model} -</span>
        <span>
          PT:
          {totalPromptTokens} -{" "}
        </span>
        <span>
          CT:
          {totalCompletionTokens}
        </span>
      </div>
    </>
  );
};
