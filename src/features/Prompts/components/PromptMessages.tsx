import { BaselinePlusIcon } from "icons/BaselinePlusIcon";
import { PromptMessage } from "./PromptMessage";
import { Control, FieldArrayWithId } from "react-hook-form";
import { PromptForm } from "../schemas/PromptSchema";

type Props = {
  fields: FieldArrayWithId<PromptForm, "messages", "id">[];
  addMessage: () => void;
  control: Control<PromptForm>;
  handleRemoveMessage: (index: number) => () => Promise<void>;
};

export const PromptMessages = ({
  fields,
  addMessage,
  control,
  handleRemoveMessage,
}: Props) => {
  return (
    <section className="w-10/12 max-w-96">
      <section className="flex justify-between items-center">
        <span className="app-text font-semibold text-lg">Messages</span>
        <button
          aria-label="Add Message"
          title="Add Message"
          type="button"
          onClick={addMessage}
        >
          <BaselinePlusIcon className="text-green-600 dark:text-green-300 hover:text-green-700 dark:hover:text-green-400 transition-colors duration-200 w-7 h-7 cursor-pointer" />
        </button>
      </section>

      <section className="mt-2 flex flex-col gap-4">
        {fields.length === 0 ? (
          <p className="app-text">No messages yet.</p>
        ) : (
          fields.map((field, index) => (
            <PromptMessage
              key={field.id}
              control={control}
              index={index}
              onRemove={handleRemoveMessage(index)}
            />
          ))
        )}
      </section>
    </section>
  );
};
