import { Select, Input } from "antd";
import { BaselineCloseIcon } from "icons/BaselineCloseIcon";
import { Control, Controller } from "react-hook-form";
import { PromptForm } from "../schemas/PromptSchema";

const { TextArea } = Input;

type Props = {
  control: Control<PromptForm>;
  index: number;
  onRemove: () => void;
};

export const PromptMessage = ({ control, index, onRemove }: Props) => {
  return (
    <div className="flex flex-col gap-4 relative">
      <button
        className="absolute top-0 right-0"
        type="button"
        aria-label="Delete Message"
        title="Delete Message"
        onClick={onRemove}
      >
        <BaselineCloseIcon className="text-2xl text-red-600 hover:text-red-800 cursor-pointer transition-colors duration-200" />
      </button>
      <Controller
        name={`messages.${index}.role`}
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            options={[
              { value: "User", label: "User" },
              { value: "Assistant", label: "Assistant" },
            ]}
            className="!w-32 mb-2"
          />
        )}
      />
      <Controller
        name={`messages.${index}.content`}
        control={control}
        render={({ field, fieldState }) => (
          <>
            <TextArea
              {...field}
              autoSize={{ minRows: 4, maxRows: 10 }}
              placeholder="Message content"
              status={fieldState.error ? "error" : undefined}
            />
            {fieldState.error && (
              <span className="text-red-500 text-sm">
                {fieldState.error.message}
              </span>
            )}
          </>
        )}
      />
    </div>
  );
};
