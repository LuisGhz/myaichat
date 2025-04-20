import { UseFormRegister, FieldErrors } from "react-hook-form";
import { PromptForm } from "../PromptSchema";

type Props = {
  register: UseFormRegister<PromptForm>;
  errors: FieldErrors<PromptForm>;
};

export const InputContent = ({ register, errors }: Props) => {
  return (
    <>
      <div className="mt-6 w-11/12 md:w-7/12 max-w-[40rem]">
        <textarea
          className="w-full h-48 p-2 bg-gray-800 text-white rounded-md"
          placeholder="Type your prompt here..."
          {...register("content")}
        ></textarea>
        {errors.content && (
          <span className="text-red-600 text-sm">{errors.content.message}</span>
        )}
      </div>
    </>
  );
};
