import {
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
  Control,
  UseFormGetValues,
  useFieldArray,
} from "react-hook-form";
import { v4 } from "uuid";
import { PromptForm } from "../PromptSchema";
import { useState } from "react";
import { ConfirmDialog } from "components/Dialogs/ConfirmDialog";
import { XMarkIcon } from "assets/icons/XMarkIcon";
import { usePrompts } from "hooks/features/Prompts/usePrompts";
import { PromptsURLParams } from "types/prompts/PromptsUrlParams.type";
import { useParams } from "react-router";
import { PlusIcon } from "assets/icons/PlusIcon";

type Props = {
  register: UseFormRegister<PromptForm>;
  errors: FieldErrors<PromptForm>;
  setValue: UseFormSetValue<PromptForm>;
  control: Control<PromptForm>;
  getValues: UseFormGetValues<PromptForm>;
};

export const MessagesForm = ({
  register,
  errors,
  control,
  getValues,
}: Props) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "messages",
  });
  const urlParams = useParams<PromptsURLParams>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<{
    index: number;
    id: string | null;
  }>({ index: -1, id: null });
  const { deletePromptMessage } = usePrompts();

  const dialogMessage = [
    "Are you sure you want to delete this message?",
    "This action cannot be undone.",
  ];

  const handleAddMessage = () => {
    append({ id: `${v4()}-default`, role: "User", content: "" });
  };

  const handleRemoveMessage = (idx: number) => {
    const messages = getValues("messages");
    const messageData = messages?.[idx];
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    const messageId = messageData?.id!;
    setMessageToDelete({ index: idx, id: messageId });
    if (messageId.includes("-default")) {
      remove(idx);
      return;
    }

    setIsDialogOpen(true);
  };

  const onConfirmDialogClose = async () => {
    if (messageToDelete.id && messageToDelete.index !== -1) {
      await deletePromptMessage(urlParams.id!, messageToDelete.id);
      remove(messageToDelete.index);
      setMessageToDelete({ index: -1, id: null });
    }

    setIsDialogOpen(false);
  };

  const onCancelDialogClose = () => {
    setMessageToDelete({ index: -1, id: null });
    setIsDialogOpen(false);
  };

  return (
    <div className="mt-6 w-11/12 md:w-7/12 max-w-[40rem]">
      <ConfirmDialog
        message={dialogMessage}
        onConfirm={onConfirmDialogClose}
        onCancel={onCancelDialogClose}
        isOpen={isDialogOpen}
      />
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold">Messages</span>
        <button
          type="button"
          className="text-green-700 hover:text-green-500 p-1 text-sm cursor-pointer transition-colors duration-200 rounded-full hover:bg-cop-2"
          onClick={handleAddMessage}
          aria-label="Add message"
        >
          <PlusIcon />
        </button>
      </div>
      {fields.length === 0 && (
        <div className="text-gray-400 text-sm">No messages added.</div>
      )}
      {fields.map((field, idx) => (
        <section
          key={field.id}
          className="flex flex-col gap-2 mb-2 items-start relative"
        >
          <select
            className="p-2 bg-cop-1 focus:bg-cop-2 text-white rounded-md w-32"
            {...register(`messages.${idx}.role` as const)}
            aria-label="Role"
          >
            <option value="User">User</option>
            <option value="Assistant">Assistant</option>
          </select>
          <textarea
            className="p-2 bg-cop-1 focus:bg-cop-2 text-white rounded-md flex-1 min-h-[80px] resize-y w-full"
            placeholder="Message content"
            {...register(`messages.${idx}.content` as const)}
          />
          <button
            type="button"
            className="text-red-700 hover:text-red-500 transition-colors hover:bg-cop-2 p-1 duration-200 bg-transparent font-bold rounded-full text-sm cursor-pointer absolute top-2 right-0"
            onClick={() => handleRemoveMessage(idx)}
            aria-label="Delete message"
          >
            <XMarkIcon />
          </button>
        </section>
      ))}
      {/* Show field-level errors for messages */}
      {Array.isArray(errors.messages) &&
        errors.messages.map((err, idx) => (
          <div key={idx} className="text-red-600 text-sm">
            {err?.content?.message && (
              <div>
                Message {idx + 1} content: {err.content.message}
              </div>
            )}
          </div>
        ))}
    </div>
  );
};
