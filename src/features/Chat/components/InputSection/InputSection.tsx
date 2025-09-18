import { KeyboardEvent, useEffect, useState } from "react";
import { Input } from "antd";
import { SendAltFilledIcon } from "icons/SendAltFilledIcon";
import { InputActionButtons } from "./InputActionButtons";
import { useChatParams } from "features/Chat/hooks/useChatParams";
import { useChat } from "features/Chat/hooks/useChat";
import { useChatStore } from "store/app/ChatStore";
import { useStreamAssistantMessage } from "features/Chat/hooks/useStreamAssistantMessage";
import { useAppStoreActions } from "store/app/AppStore";

const { TextArea } = Input;

export const InputSection = () => {
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const params = useChatParams();
  const { sendNewMessage } = useChat();
  const { model, maxOutputTokens, isWebSearchMode, promptId } = useChatStore();
  const { startStreaming } = useStreamAssistantMessage();
  const { setIsGettingNewChat } = useAppStoreActions();

  useEffect(() => {
    setNewMessage("");
  }, [params.id]);

  const handleSendMessage = async () => {
    if (isSending || newMessage.trim() === "") return;
    if (!params.id) setIsGettingNewChat(true);
    setNewMessage("");
    setIsSending(true);
    const req: SendNewMessageReq = {
      chatId: params.id || undefined,
      content: newMessage.trim(),
      model,
      maxOutputTokens,
      isWebSearchMode,
      file: undefined,
      promptId,
    };

    const chatId = await sendNewMessage(req);
    if (chatId) await startStreaming(chatId);
    setIsSending(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey && e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <section className="w-full md:w-11/12 xl:10/12 mx-auto border-[1px] border-b-0 border-gray-300 rounded-t-lg p-2 pb-4">
      <section className="flex gap-2 items-end mb-2 px-1">
        <TextArea
          className="!bg-transparent !border-0 !resize-none focus:!border-0 focus:!ring-0 scroll-hidden !text-gray-700 dark:!text-gray-200"
          placeholder="Type a message..."
          autoSize={{ minRows: 2, maxRows: 20 }}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isSending}
        />
        {newMessage.trim() !== "" && (
          <button
            type="button"
            onClick={handleSendMessage}
            aria-label="Send message"
            disabled={isSending}
          >
            <SendAltFilledIcon className="w-6 h-6 cursor-pointer fill-gray-700 dark:fill-gray-200" />
          </button>
        )}
      </section>
      <InputActionButtons />
    </section>
  );
};
