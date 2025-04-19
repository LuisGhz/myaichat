import { FieldErrors, UseFormRegister } from "react-hook-form";
import { PromptForm } from "../PromptSchema";

type Props = {
  register: UseFormRegister<PromptForm>;
  errors: FieldErrors<PromptForm>;
};

export const InputName = ({ register, errors }: Props) => {
  return (
    <>
      <div className="mt-6 w-96">
        <input
          type="text"
          className="w-full p-2 bg-gray-800 text-white rounded-md"
          placeholder="Enter prompt name..."
          {...register("name")}
        />
        {errors.name && (
          <span className="text-red-600 text-sm">{errors.name.message}</span>
        )}
      </div>
    </>
  );
};
