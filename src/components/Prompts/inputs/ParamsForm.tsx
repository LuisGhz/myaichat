import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
import { PromptForm } from "../PromptSchema";
import { useState } from "react";

type Props = {
  register: UseFormRegister<PromptForm>;
  errors: FieldErrors<PromptForm>;
  setValue: UseFormSetValue<PromptForm>;
};

export const ParamsForm = ({ register, errors, setValue }: Props) => {
  const [params, setParams] = useState<
    { name: string; value: string }[]
  >([]);

  const handleAddParam = () => {
    const newParams = [...params, { name: "", value: "" }];
    setParams(newParams);
    setValue("params", newParams);
  };

  const handleRemoveParam = (idx: number) => {
    const newParams = params.filter((_, i) => i !== idx);
    setParams(newParams);
    setValue("params", newParams);
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
        <div key={idx} className="flex gap-2 mb-2 items-center">
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
            onChange={(e) =>
              handleParamChange(idx, "value", e.target.value)
            }
          />
          <button
            type="button"
            className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-sm"
            onClick={() => handleRemoveParam(idx)}
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
