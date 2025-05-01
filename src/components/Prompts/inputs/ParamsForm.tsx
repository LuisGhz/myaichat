import {
  UseFormRegister,
  FieldErrors,
  useFieldArray,
  Control,
  UseFormGetValues,
} from "react-hook-form";
import { v4 } from "uuid";
import { PromptForm } from "../PromptSchema";
import { useState } from "react";
import { usePrompts } from "hooks/usePrompts";
import { useParams } from "react-router";
import { PromptsURLParams } from "types/prompts/PromptsUrlParams.type";
import { ConfirmDialog } from "components/Dialogs/ConfirmDialog";
import { XMarkIcon } from "assets/icons/XMarkIcon";

type Props = {
  register: UseFormRegister<PromptForm>;
  errors: FieldErrors<PromptForm>;
  control: Control<PromptForm>;
  getValues: UseFormGetValues<PromptForm>;
};

export const ParamsForm = ({ register, errors, control, getValues }: Props) => {
  const { deletePromptParam } = usePrompts();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "params",
  });
  const urlParams = useParams<PromptsURLParams>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [paramToDelete, setParamToDelete] = useState<{
    index: number;
    id: string | null;
  }>({ index: -1, id: null });
  const dialogMessage = [
    "Are you sure you want to delete this parameter?",
    "This action cannot be undone.",
  ];

  const handleAddParam = () => {
    append({ id: `${v4()}-default`, name: "", value: "" });
  };

  const handleRemoveParam = async (index: number) => {
    const params = getValues("params");
    const paramData = params?.[index];
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    const actualId = paramData?.id!;
    setParamToDelete({ index, id: actualId });
    if (actualId.includes("-default")) {
      remove(index);
      setParamToDelete({ index: -1, id: null });
      return;
    }
    setIsDialogOpen(true);
  };

  const onConfirmDialogClose = async () => {
    if (paramToDelete.id && paramToDelete.index !== -1) {
      await deletePromptParam(urlParams.id!, paramToDelete.id);
      remove(paramToDelete.index);
    }
    setIsDialogOpen(false);
    setParamToDelete({ index: -1, id: null });
  };

  const onCancelDialogClose = () => {
    setIsDialogOpen(false);
    setParamToDelete({ index: -1, id: null });
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
      {fields.length === 0 && (
        <div className="text-gray-400 text-sm">No params added.</div>
      )}
      {fields.map((field, idx) => (
        <div key={field.id} className="flex gap-2 mb-2 items-center">
          <input
            type="text"
            className="p-2 bg-cop-1 focus:bg-cop-2 text-white rounded-md flex-1"
            placeholder="Param name"
            {...register(`params.${idx}.name` as const)}
          />
          <input
            type="text"
            className="p-2 bg-cop-1 focus:bg-cop-2 text-white rounded-md flex-1"
            placeholder="Default value"
            {...register(`params.${idx}.value` as const)}
          />
          <button
            className="text-red-700 bg-transparent font-bold rounded-4xl text-sm cursor-pointer"
            type="button"
            onClick={() => handleRemoveParam(idx)}
            aria-label="Delete param"
          >
            <XMarkIcon />
          </button>
        </div>
      ))}
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
      {errors.params?.root?.message && (
        <div className="text-red-600 text-sm">{errors.params.root.message}</div>
      )}
    </div>
  );
};
