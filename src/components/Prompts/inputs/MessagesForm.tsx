import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
import { PromptForm } from "../PromptSchema";
import { useState } from "react";

type Props = {
  register: UseFormRegister<PromptForm>;
  errors: FieldErrors<PromptForm>;
  setValue: UseFormSetValue<PromptForm>;
};

export const MessagesForm = ({ register, errors, setValue }: Props) => {
  const [messages, setMessages] = useState<
    { role: "User" | "Assistant"; content: string }[]
  >([]);

  return (
    <div className="mt-6 w-11/12 md:w-7/12 max-w-[40rem]">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold">Messages</span>
        <button
          type="button"
          className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-sm"
          onClick={() => {
            const newMessages = [
              ...messages,
              { role: "User" as const, content: "" },
            ];
            setMessages(newMessages);
            setValue("messages", newMessages);
          }}
        >
          + Add Message
        </button>
      </div>
      {messages.length === 0 && (
        <div className="text-gray-400 text-sm">No messages added.</div>
      )}
      {messages.map((message, idx) => (
        <section key={idx} className="flex flex-col gap-2 mb-2 items-start relative">
          <select
            className="p-2 bg-gray-800 text-white rounded-md w-32"
            value={message.role}
            onChange={(e) => {
              const newMessages = [...messages];
              newMessages[idx].role = e.target.value as "User" | "Assistant";
              setMessages(newMessages);
              setValue("messages", newMessages);
            }}
          >
            <option value="User">User</option>
            <option value="Assistant">Assistant</option>
          </select>
          <textarea
            className="p-2 bg-gray-800 text-white rounded-md flex-1 min-h-[80px] resize-y w-full"
            placeholder="Message content"
            value={message.content}
            {...register(`messages.${idx}.content` as const)}
            onChange={(e) => {
              const newMessages = [...messages];
              newMessages[idx].content = e.target.value;
              setMessages(newMessages);
              setValue("messages", newMessages);
            }}
          />
          <button
            type="button"
            className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-sm absolute top-2 right-2"
            onClick={() => {
              const newMessages = messages.filter((_, i) => i !== idx);
              setMessages(newMessages);
              setValue("messages", newMessages);
            }}
            aria-label="Delete message"
          >
            ✕
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
