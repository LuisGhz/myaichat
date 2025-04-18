import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const promptSchema = z.object({
  title: z.string().min(1, "Title is required"),
  prompt: z.string().min(1, "Prompt is required"),
  messages: z
    .array(
      z.object({
        role: z.enum(["User", "Assistant"]),
        content: z.string().min(1, "Is required"),
      })
    )
    .optional(),
  params: z
    .array(
      z.object({
        name: z.string().min(1, "Is required"),
        defaultValue: z.string().min(1, "Is required"),
      })
    )
    .optional(),
});

type PromptForm = z.infer<typeof promptSchema>;

export const Prompts = () => {
  const [params, setParams] = useState<
    { name: string; defaultValue: string }[]
  >([]);
  const [messages, setMessages] = useState<
    { role: "User" | "Assistant"; content: string }[]
  >([]);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PromptForm>({
    resolver: zodResolver(promptSchema),
    defaultValues: { params: [], messages: [] },
  });

  const onSubmit = (data: PromptForm) => {
    // Handle form submission (e.g., save prompt)
    console.log(data);
  };

  const handleAddParam = () => {
    const newParams = [...params, { name: "", defaultValue: "" }];
    setParams(newParams);
    setValue("params", newParams);
  };

  const handleRemoveParam = (idx: number) => {
    const newParams = params.filter((_, i) => i !== idx);
    setParams(newParams);
    setValue("params", newParams);
  };

  const handleParamChange = (
    idx: number,
    field: "name" | "defaultValue",
    value: string
  ) => {
    const newParams = params.map((param, i) =>
      i === idx ? { ...param, [field]: value } : param
    );
    setParams(newParams);
    setValue("params", newParams);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col h-full items-center justify-center text-white">
        <h1 className="text-2xl font-bold">Prompt</h1>
        <p className="text-lg mt-4">Create/Edit a prompt here.</p>
        <div className="mt-6 w-96">
          <input
            type="text"
            className="w-full p-2 bg-gray-800 text-white rounded-md"
            placeholder="Enter prompt title..."
            {...register("title")}
          />
          {errors.title && (
            <span className="text-red-400 text-sm">{errors.title.message}</span>
          )}
        </div>

        <div className="mt-6 w-96">
          <textarea
            className="w-full h-48 p-2 bg-gray-800 text-white rounded-md"
            placeholder="Type your prompt here..."
            {...register("prompt")}
          ></textarea>
          {errors.prompt && (
            <span className="text-red-400 text-sm">
              {errors.prompt.message}
            </span>
          )}
        </div>
        {/* Messages Section */}
        <div className="mt-6 w-96">
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
            <div key={idx} className="flex gap-2 mb-2 items-center">
              <select
                className="p-2 bg-gray-800 text-white rounded-md"
                value={message.role}
                onChange={e => {
                  const newMessages = [...messages];
                  newMessages[idx].role = e.target.value as "User" | "Assistant";
                  setMessages(newMessages);
                  setValue("messages", newMessages);
                }}
              >
                <option value="User">User</option>
                <option value="Assistant">Assistant</option>
              </select>
              <input
                type="text"
                className="p-2 bg-gray-800 text-white rounded-md flex-1"
                placeholder="Message content"
                value={message.content}
                {...register(`messages.${idx}.content` as const)}
                onChange={e => {
                  const newMessages = [...messages];
                  newMessages[idx].content = e.target.value;
                  setMessages(newMessages);
                  setValue("messages", newMessages);
                }}
              />
              <button
                type="button"
                className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-sm"
                onClick={() => {
                  const newMessages = messages.filter((_, i) => i !== idx);
                  setMessages(newMessages);
                  setValue("messages", newMessages);
                }}
                aria-label="Delete message"
              >
                ✕
              </button>
            </div>
          ))}
          {/* Show field-level errors for messages */}
          {Array.isArray(errors.messages) &&
            errors.messages.map((err, idx) => (
              <div key={idx} className="text-red-400 text-sm">
                {err?.content?.message && (
                  <div>Message {idx + 1} content: {err.content.message}</div>
                )}
              </div>
            ))}
        </div>
        {/* Dynamic Params Section */}
        <div className="mt-6 w-96">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">Params</span>
            <button
              type="button"
              className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-sm"
              onClick={handleAddParam}
            >
              + Add Param
            </button>
          </div>
          {params.length === 0 && (
            <div className="text-gray-400 text-sm">No params added.</div>
          )}
          {params.map((param, idx) => (
            <div key={idx} className="flex gap-2 mb-2 items-center">
              <input
                type="text"
                className="p-2 bg-gray-800 text-white rounded-md flex-1"
                placeholder="Param name"
                {...register(`params.${idx}.name` as const, { required: true })}
                value={param.name}
                onChange={(e) => handleParamChange(idx, "name", e.target.value)}
              />
              <input
                type="text"
                className="p-2 bg-gray-800 text-white rounded-md flex-1"
                placeholder="Default value"
                {...register(`params.${idx}.defaultValue` as const, {
                  required: true,
                })}
                value={param.defaultValue}
                onChange={(e) =>
                  handleParamChange(idx, "defaultValue", e.target.value)
                }
              />
              <button
                type="button"
                className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-sm"
                onClick={() => handleRemoveParam(idx)}
                aria-label="Delete param"
              >
                ✕
              </button>
            </div>
          ))}
          {/* Show field-level errors for params */}
          {Array.isArray(errors.params) &&
            errors.params.map((err, idx) => (
              <div key={idx} className="text-red-400 text-sm">
                {err?.name?.message && (
                  <div>
                    Param {idx + 1} name: {err.name.message}
                  </div>
                )}
                {err?.defaultValue?.message && (
                  <div>
                    Param {idx + 1} value: {err.defaultValue.message}
                  </div>
                )}
              </div>
            ))}
        </div>
        <button
          type="submit"
          className="mt-8 w-96 p-2 bg-blue-600 hover:bg-blue-700 rounded-md font-semibold"
        >
          Save Prompt
        </button>
      </div>
    </form>
  );
};
