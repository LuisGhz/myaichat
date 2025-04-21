import {
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
  UseFormGetValues,
} from "react-hook-form";
import { v4 } from "uuid";
import { PromptForm } from "../PromptSchema";
import { useEffect, useState } from "react";
import { usePrompts } from "hooks/usePrompts";
import { useParams } from "react-router";
import { PromptsURLParams } from "types/prompts/PromptsUrlParams.type";
import { ConfirmDialog } from "components/Dialogs/ConfirmDialog";
import { PromptParams } from "types/prompts/PromptParams.type";

type Props = {
  register: UseFormRegister<PromptForm>;
  errors: FieldErrors<PromptForm>;
  setValue: UseFormSetValue<PromptForm>;
  getValues: UseFormGetValues<PromptForm>;
};

export const ParamsForm = ({
  register,
  errors,
  setValue,
  getValues,
}: Props) => {
  const { deletePromptParam } = usePrompts();
  const [params, setParams] = useState<PromptParams[]>([]);
  const urlParams = useParams<PromptsURLParams>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [paramToDelete, setParamToDelete] = useState<string | null>(null);
  const dialogMessage = [
    "Are you sure you want to delete this parameter?",
    "This action cannot be undone.",
  ];

  useEffect(() => {
    const initialParams = getValues("params") || [];
    setParams(initialParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddParam = () => {
    const id = `${v4()}-default`;
    const newParams = [...params, { id, name: "", value: "" }];
    setParams(newParams);
    setValue("params", newParams);
  };

  const removeParamFromForm = (id: string) => {
    const newParams = params.filter((p) => p.id !== id);
    setParams(newParams);
    setValue("params", newParams);
    setParamToDelete(null);
  };

  const handleRemoveParam = async (id: string) => {
    setParamToDelete(() => id);
    if (!id.includes("-default")) {
      setIsDialogOpen(true);
      return;
    }
    removeParamFromForm(id);
  };

  const onConfirmDialogClose = async () => {
    await deletePromptParam(urlParams.id!, paramToDelete!);
    removeParamFromForm(paramToDelete!);
    setIsDialogOpen(false);
  };

  const onCancelDialogClose = () => {
    setIsDialogOpen(false);
    setParamToDelete(null);
  };

  const handleParamChange = (
    idx: number,
    field: "name" | "value",
    value: string
  ) => {
    const newParams = params.map((param, i) =>
      i === idx ? { ...param, [field]: value } : param
    );
    setParams(newParams);
    setValue("params", newParams);
  };

  return (
    <div className="mt-6 w-11/12 md:w-7/12 max-w-[40rem]">
      <ConfirmDialog
        isOpen={isDialogOpen}
        message={dialogMessage}
        onConfirm={onConfirmDialogClose}
        onCancel={onCancelDialogClose}
      />
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold">Params</span>
        <button
          type="button"
          className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-sm"
          onClick={handleAddParam}
        >
          + Add Param
        </button>
      </div>
      {params.length === 0 && (
        <div className="text-gray-400 text-sm">No params added.</div>
      )}
      {params.map((param, idx) => (
        <div key={param.id} className="flex gap-2 mb-2 items-center">
          <input
            type="text"
            className="p-2 bg-gray-800 text-white rounded-md flex-1"
            placeholder="Param name"
            {...register(`params.${idx}.name` as const, { required: true })}
            value={param.name}
            onChange={(e) => handleParamChange(idx, "name", e.target.value)}
          />
          <input
            type="text"
            className="p-2 bg-gray-800 text-white rounded-md flex-1"
            placeholder="Default value"
            {...register(`params.${idx}.value` as const, {
              required: true,
            })}
            value={param.value}
            onChange={(e) => handleParamChange(idx, "value", e.target.value)}
          />
          <button
            type="button"
            className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-sm"
            onClick={() => handleRemoveParam(param.id)}
            aria-label="Delete param"
          >
            ✕
          </button>
        </div>
      ))}
      {/* Show field-level errors for params */}
      {Array.isArray(errors.params) &&
        errors.params.map((err, idx) => (
          <div key={idx} className="text-red-600 text-sm">
            {err?.name?.message && (
              <div>
                Param {idx + 1} name: {err.name.message}
              </div>
            )}
            {err?.value?.message && (
              <div>
                Param {idx + 1} value: {err.value.message}
              </div>
            )}
          </div>
        ))}
    </div>
  );
};
