import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PromptForm, promptSchema } from "./PromptSchema";
import { InputName } from "./inputs/InputName";
import { InputContent } from "./inputs/InputContent";
import { MessagesForm } from "./inputs/MessagesForm";
import { ParamsForm } from "./inputs/ParamsForm";
import { usePromptForm } from "hooks/usePromptForm";
import { Link } from "react-router";

export const PromptsForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PromptForm>({
    resolver: zodResolver(promptSchema),
    defaultValues: { params: [], messages: [] },
  });
  const { onPromptFormSubmit } = usePromptForm();

  const onSubmit = (data: PromptForm) => {
    const res = onPromptFormSubmit(data);
    if (res) {
      console.log("Prompt created successfully:", res);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col h-full items-center justify-center text-white">
        <h1 className="text-2xl font-bold">Prompt</h1>
        <p className="text-lg mt-4">Create/Edit a prompt here.</p>
        <InputName register={register} errors={errors} />
        <InputContent register={register} errors={errors} />
        {/* Messages Section */}
        <MessagesForm register={register} errors={errors} setValue={setValue} />
        {/* Dynamic Params Section */}
        <ParamsForm register={register} errors={errors} setValue={setValue} />
        <section className="flex gap-5">
          <button
            className="mt-8 w-36 p-2 bg-blue-600 hover:bg-blue-700 rounded-md font-semibold"
            type="button"
          >
            <Link to={"/prompts"} className="text-white">
              Go back
            </Link>
          </button>
          <button
            className="mt-8 w-36 p-2 bg-blue-600 hover:bg-blue-700 rounded-md font-semibold"
            type="submit"
          >
            Save Prompt
          </button>
        </section>
      </div>
    </form>
  );
};
