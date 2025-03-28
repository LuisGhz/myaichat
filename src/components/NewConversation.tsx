import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { Models } from "types/chat/Models.type";

type Props = {
  model: Models;
  setModel: Dispatch<SetStateAction<Models>>;
};

export const NewConversation = ({ model, setModel }: Props) => {
  const models: Models[] = ["gpt-4o-mini", "gpt-4o"];

  const updateModel = (e: ChangeEvent<HTMLSelectElement>) => {
    setModel(e.target.value as Models);
  };

  return (
    <div className="text-white text-center mt-10">
      <h1 className="text-2xl">Hello, what can assist you today?</h1>
      <div className="mt-5">
        <select 
          name="model" 
          id="model" 
          value={model} 
          onChange={updateModel}
          autoFocus
          className="bg-cop-1 text-white border border-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-0 focus:bg-cop-2"
        >
          {models.map((model) => (
            <option key={model} value={model} className="bg-gray-800 text-white">
              {model}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
