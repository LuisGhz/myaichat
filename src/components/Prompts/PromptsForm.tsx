import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PromptForm, promptSchema } from "./PromptSchema";
import { InputName } from "./inputs/InputName";
import { InputContent } from "./inputs/InputContent";
import { MessagesForm } from "./inputs/MessagesForm";
import { ParamsForm } from "./inputs/ParamsForm";
import { usePromptForm } from "hooks/usePromptForm";
import { Link, useNavigate, useParams } from "react-router";
import { usePrompts } from "hooks/usePrompts";
import { useEffect, useState } from "react";
import { PromptsURLParams } from "types/prompts/PromptsUrlParams.type";

export const PromptsForm = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const params = useParams<PromptsURLParams>();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isValid },
    getValues,
    reset,
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
          reset({
            name: prompt.name,
            content: prompt.content,
            messages: prompt.messages || [],
            params: prompt.params || [],
          });
        }
        setIsLoaded(true);
      }
    };
    if (!params.id) setIsLoaded(true);
    fetchPrompt();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const onSubmit = async (data: PromptForm) => {
    if (!isValid) return;
    if (params.id) {
      const res = await onPromptUpdateFormSubmit(params.id!, data);
      if (res) naviageAfterRequest();
      return;
    }
    const res = await onPromptFormSubmit(data);
    if (res) naviageAfterRequest();
  };

  const naviageAfterRequest = () => {
    setTimeout(() => navigate("/prompts"), 500);
  };

  return (
    <>
      {params.id && loading && <p>loading</p>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col h-full items-center justify-center text-white pt-4">
          <h1 className="text-2xl font-bold">Prompt</h1>
          {!params.id && (
            <p className="text-lg mt-4 text-cop-7">Create a prompt here.</p>
          )}
          {params.id && (
            <p className="text-lg mt-4 text-cop-7">Edit your prompt here.</p>
          )}
          <InputName register={register} errors={errors} />
          <InputContent register={register} errors={errors} />
          {/* Messages Section */}
          {isLoaded && (
            <MessagesForm
              register={register}
              errors={errors}
              setValue={setValue}
              control={control}
              getValues={getValues}
            />
          )}
          {/* Dynamic Params Section */}
          {isLoaded && (
            <ParamsForm
              register={register}
              errors={errors}
              control={control}
              getValues={getValues}
            />
          )}
          <section className="flex gap-5">
            <button
              className="mt-8 w-36 bg-blue-600 hover:bg-blue-700 rounded-md font-semibold cursor-pointer"
              type="button"
            >
              <Link className="text-white flex justify-center items-center h-full align-middle" to={"/prompts"}>
                <span>Go back</span>
              </Link>
            </button>
            <button
              className="mt-8 w-36 p-2 bg-blue-600 hover:bg-blue-700 rounded-md font-semibold cursor-pointer"
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
