import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PromptForm, promptSchema } from "./PromptSchema";
import { InputName } from "./inputs/InputName";
import { InputContent } from "./inputs/InputContent";
import { MessagesForm } from "./inputs/MessagesForm";
import { ParamsForm } from "./inputs/ParamsForm";
import { usePromptForm } from "hooks/usePromptForm";
import { Link, useParams } from "react-router";
import { usePrompts } from "hooks/usePrompts";
import { useEffect } from "react";

export const PromptsForm = () => {
  const params = useParams<{ id?: string }>();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PromptForm>({
    resolver: zodResolver(promptSchema),
    defaultValues: { params: [], messages: [] },
  });
  const { onPromptFormSubmit, onPromptUpdateFormSubmit } = usePromptForm();
  const { getPromptById, loading } = usePrompts();

  useEffect(() => {
    const fetchPrompt = async () => {
      if (params.id) {
        const prompt = await getPromptById(params.id);
        if (prompt) {
          setValue("name", prompt.name);
          setValue("content", prompt.content);
          setValue("messages", prompt.messages || []);
          setValue("params", prompt.params || []);
        }
      }
    };
    fetchPrompt();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const onSubmit = async (data: PromptForm) => {
    if (params.id) {
      await onPromptUpdateFormSubmit(params.id!, data);
      return;
    }
    const res = await onPromptFormSubmit(data);
    if (res) {
      console.log("Prompt created successfully:", res);
    }
  };

  return (
    <>
      {params.id && loading && <p>loading</p>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col h-full items-center justify-center text-white pt-4">
          <h1 className="text-2xl font-bold">Prompt</h1>
          {!params.id  && <p className="text-lg mt-4 text-cop-7">Create a prompt here.</p>}
          {params.id  && <p className="text-lg mt-4 text-cop-7">Edit your prompt here.</p>}
          <InputName register={register} errors={errors} />
          <InputContent register={register} errors={errors} />
          {/* Messages Section */}
          <MessagesForm
            register={register}
            errors={errors}
            setValue={setValue}
          />
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
    </>
  );
};
