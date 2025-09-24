import { useNavigate, useParams } from "react-router";
import { Input, Button, message } from "antd";
import { BaselinePlusIcon } from "icons/BaselinePlusIcon";
import { PromptMessage } from "../components/PromptMessage";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { promptSchema, PromptForm } from "../schemas/PromptSchema";
import { usePromptForm } from "../hooks/usePromptForm";
import { usePrompts } from "../hooks/usePrompts";
import { useEffect, useState } from "react";

const { TextArea } = Input;

export const CreateEditPrompt = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEditMode = Boolean(id);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(isEditMode);

  const { onPromptFormSubmit, onPromptUpdateFormSubmit } = usePromptForm();
  const { getPromptById } = usePrompts();

  const {
    control,
    handleSubmit,
    reset,
  } = useForm<PromptForm>({
    resolver: zodResolver(promptSchema),
    defaultValues: {
      name: "",
      content: "",
      messages: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "messages",
  });

  useEffect(() => {
    if (isEditMode && id) {
      const fetchPrompt = async () => {
        try {
          const prompt = await getPromptById(id);
          if (prompt) {
            const formData = {
              name: prompt.name,
              content: prompt.content,
              messages: prompt.messages?.map((msg, index) => ({
                ...msg,
                id: msg.id || `default-${index}`,
              })) || [],
            };
            reset(formData);
          } else {
            message.error("Prompt not found");
            navigate("/prompts");
          }
        } catch (error) {
          console.error("Error fetching prompt:", error);
          message.error("Failed to load prompt");
          navigate("/prompts");
        } finally {
          setIsInitialLoading(false);
        }
      };

      fetchPrompt();
    } else if (!isEditMode) {
      // Not in edit mode, so we don't need to load anything
      setIsInitialLoading(false);
    }
  }, [id, isEditMode, getPromptById, reset, navigate]);

  const onSubmit = async (data: PromptForm) => {
    setIsLoading(true);
    try {
      if (isEditMode && id) {
        await onPromptUpdateFormSubmit(id, data);
        message.success("Prompt updated successfully!");
      } else {
        await onPromptFormSubmit(data);
        message.success("Prompt created successfully!");
      }
      navigate("/prompts");
    } catch {
      message.error(`Failed to ${isEditMode ? "update" : "create"} prompt`);
    } finally {
      setIsLoading(false);
    }
  };

  const addMessage = () => {
    append({
      id: `default-${Date.now()}`,
      role: "User",
      content: "",
    });
  };

  if (isInitialLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="app-text">Loading prompt...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex items-center h-full flex-col gap-4">
      <h2 className="text-xl app-text font-semibold">
        {isEditMode ? "Edit Prompt" : "Create Prompt"}
      </h2>
      <p className="app-text">
        {isEditMode ? "Edit your prompt here." : "Create a prompt here."}
      </p>
      
      <section className="flex flex-col gap-2 w-full items-center">
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <>
              <Input
                {...field}
                className="!w-10/12 max-w-96"
                placeholder="Prompt Title"
                status={fieldState.error ? "error" : undefined}
              />
              {fieldState.error && (
                <span className="text-red-500 text-sm">{fieldState.error.message}</span>
              )}
            </>
          )}
        />
        
        <Controller
          name="content"
          control={control}
          render={({ field, fieldState }) => (
            <>
              <TextArea
                {...field}
                className="scroll-hidden !w-10/12 !max-w-96"
                placeholder="Prompt Content"
                autoSize={{ minRows: 4, maxRows: 8 }}
                status={fieldState.error ? "error" : undefined}
              />
              {fieldState.error && (
                <span className="text-red-500 text-sm">{fieldState.error.message}</span>
              )}
            </>
          )}
        />
      </section>

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
                onRemove={() => remove(index)}
              />
            ))
          )}
        </section>
      </section>

      <section className="flex gap-8">
        <Button
          className="w-30"
          type="default"
          htmlType="button"
          onClick={() => navigate("/prompts")}
          disabled={isLoading}
        >
          Go back
        </Button>
        <Button
          className="w-30"
          type="primary"
          htmlType="submit"
          loading={isLoading}
        >
          {isEditMode ? "Update Prompt" : "Save Prompt"}
        </Button>
      </section>
    </form>
  );
};
