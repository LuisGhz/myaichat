import { useNavigate, useParams } from "react-router";
import { Input, Button, message } from "antd";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { promptSchema, PromptForm } from "../schemas/PromptSchema";
import { usePromptForm } from "../hooks/usePromptForm";
import { usePrompts } from "../hooks/usePrompts";
import { useEffect, useState } from "react";
import { PromptMessages } from "../components/PromptMessages";
import { ConfirmationModal } from "shared/modals/ConfirmationModal";

const { TextArea } = Input;

export const CreateEditPrompt = () => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [messageIndexToDelete, setMessageIndexToDelete] = useState<
    number | null
  >(null);
  const navigate = useNavigate();
  const { id: promptId } = useParams<{ id?: string }>();
  const isEditMode = Boolean(promptId);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(isEditMode);

  const { onPromptFormSubmit, onPromptUpdateFormSubmit } = usePromptForm();
  const { getPromptById, deletePromptMessage } = usePrompts();

  const { control, handleSubmit, reset, getValues } = useForm<PromptForm>({
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
    if (isEditMode && promptId) {
      const fetchPrompt = async () => {
        try {
          const prompt = await getPromptById(promptId);
          if (prompt) {
            const formData = {
              name: prompt.name,
              content: prompt.content,
              messages:
                prompt.messages?.map((msg, index) => ({
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
  }, [promptId, isEditMode, getPromptById, reset, navigate]);

  const onSubmit = async (data: PromptForm) => {
    setIsLoading(true);
    try {
      if (isEditMode && promptId) {
        await onPromptUpdateFormSubmit(promptId, data);
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

  const removePromptMessage = async (index: number) => {
    const messages = getValues("messages");
    const messageId = messages?.[index]?.id;
    try {
      // Only attempt to delete from backend if it's an existing message
      if (
        isEditMode &&
        promptId &&
        messageId &&
        !messageId.startsWith("default-")
      )
        await deletePromptMessage(promptId, messageId);
      remove(index);
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const handleRemoveMessage = (index: number) => async () => {
    // Get the actual message ID from form values, not the field array's internal ID
    const messages = getValues("messages");
    const messageId = messages?.[index]?.id;
    if (messageId && !messageId.startsWith("default-")) {
      setMessageIndexToDelete(index);
      setIsConfirmModalOpen(true);
      return;
    }
    removePromptMessage(index);
  };

  const onConfirmRemove = async () => {
    if (messageIndexToDelete) {
      await removePromptMessage(messageIndexToDelete);
      setMessageIndexToDelete(null);
      setIsConfirmModalOpen(false);
    }
  };

  const onCloseModal = () => {
    setIsConfirmModalOpen(false);
    setMessageIndexToDelete(null);
  };

  if (isInitialLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="app-text">Loading prompt...</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex items-center h-full flex-col gap-4"
    >
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
                <span className="text-red-500 text-sm">
                  {fieldState.error.message}
                </span>
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
                <span className="text-red-500 text-sm">
                  {fieldState.error.message}
                </span>
              )}
            </>
          )}
        />
      </section>
      <PromptMessages
        fields={fields}
        addMessage={addMessage}
        control={control}
        handleRemoveMessage={handleRemoveMessage}
      />
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
      <ConfirmationModal
        message={[
          "Are you sure you want to delete this message?",
          "This action cannot be undone.",
        ]}
        onConfirm={onConfirmRemove}
        onClose={onCloseModal}
        isOpen={isConfirmModalOpen}
      />
    </form>
  );
};
