import { ChangeEvent, Dispatch, SetStateAction, useEffect } from "react";
import { MODELS } from "consts/Models";
import { usePrompts } from "hooks/features/Prompts/usePrompts";
import { ModelsValues } from "types/chat/ModelsValues.type";

type Props = {
  model: ModelsValues;
  setModel: Dispatch<SetStateAction<ModelsValues>>;
  promptId: string;
  setPromptId: Dispatch<SetStateAction<string>>;
};

export const NewConversation = ({
  model,
  setModel,
  promptId,
  setPromptId,
}: Props) => {
  const { prompts, getPrompts } = usePrompts();

  useEffect(() => {
    const fetchPrompts = async () => {
      await getPrompts();
    };
    fetchPrompts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateModel = (e: ChangeEvent<HTMLSelectElement>) => {
    setModel(e.target.value as ModelsValues);
  };

  const updatePrompt = (e: ChangeEvent<HTMLSelectElement>) => {
    setPromptId(e.target.value);
  };

  return (
    <div className="text-white text-center">
      <h1 className="text-2xl">Hello, what can assist you today?</h1>
      <div className="mt-5 flex flex-col gap-4 items-center">
        <label htmlFor="model" className="sr-only">
          model
        </label>
        <select
          name="model"
          id="model"
          value={model}
          onChange={updateModel}
          autoFocus
          className="bg-cop-1 text-white border border-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-0 focus:bg-cop-2 cursor-pointer"
          aria-label="model"
        >
          {MODELS.map(({ name, value }) => (
            <option key={value} value={value} className="text-white">
              {name}
            </option>
          ))}
        </select>
        <label htmlFor="prompt" className="sr-only">
          prompt
        </label>
        <select
          className="bg-cop-1 text-white border border-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-0 focus:bg-cop-2 cursor-pointer"
          name="prompt"
          id="prompt"
          value={promptId}
          onChange={updatePrompt}
        >
          <option value="">Select a prompt if you wish</option>
          {prompts?.map((prompt) => (
            <option key={prompt.id} value={prompt.id} className="text-white">
              {prompt.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
