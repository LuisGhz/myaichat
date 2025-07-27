import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import { Message } from "types/chat/Message.type";
import { InputSection } from "./components/InputSection/InputSection";
import { NewMessageReq } from "types/chat/NewMessageReq.type";
import { NewConversation } from "./components/NewConversation";
import { ModelsValues } from "types/chat/ModelsValues.type";
import { useAppAddChatStore } from "store/useAppStore";
import {
  useCurrentChatStoreGetDefaultMaxOutputTokens,
  useCurrentChatStoreGetIsWebSearchMode,
  useCurrentChatStoreGetMaxOutputTokens,
  useCurrentChatStoreSetCurrentModelData,
  useCurrentChatStoreSetIsWebSearchMode,
  useCurrentChatStoreSetMaxOutputTokens,
} from "store/features/chat/useCurrentChatStore";
import { useChats } from "hooks/features/Chat/useChats";
import { Messages } from "./components/Messages/Messages";

export const NewChatPage = () => {
  const addChat = useAppAddChatStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [model, setModel] = useState<ModelsValues>("gemini-2.0-flash");
  const [totalPromptTokens, setTotalPromptTokens] = useState(0);
  const [totalCompletionTokens, setTotalCompletionTokens] = useState(0);
  const [promptId, setPromptId] = useState<string>("");
  const [isWelcomeLoaded, setIsWelcomeLoaded] = useState(false);
  const setCurrentModelData = useCurrentChatStoreSetCurrentModelData();
  const setMaxOutputTokens = useCurrentChatStoreSetMaxOutputTokens();
  const defaultMaxOutputTokens = useCurrentChatStoreGetDefaultMaxOutputTokens();
  const maxOutputTokens = useCurrentChatStoreGetMaxOutputTokens();
  const isWebSearchMode = useCurrentChatStoreGetIsWebSearchMode();
  const setIsWebSearchMode = useCurrentChatStoreSetIsWebSearchMode();
  const navigate = useNavigate();
  const { sendNewMessage, isSending } = useChats();
  const isSendingFirstMessage = useRef(false);

  useEffect(() => {
    // Reset state for new chat
    setMessages([]);
    setTotalPromptTokens(0);
    setTotalCompletionTokens(0);
    setMaxOutputTokens(defaultMaxOutputTokens);
    setIsWebSearchMode(false);
  }, [defaultMaxOutputTokens, setMaxOutputTokens, setIsWebSearchMode]);

  useEffect(() => {
    setCurrentModelData({
      model,
      totalPromptTokens,
      totalCompletionTokens,
    });
  }, [model, totalPromptTokens, totalCompletionTokens, setCurrentModelData]);

  const sendMessage = async (newUserMessage: string, file?: File) => {
    const req: NewMessageReq = {
      chatId: undefined,
      prompt: newUserMessage,
      file,
      promptId,
      maxOutputTokens,
      isWebSearchMode,
      model,
    };

    const res = await sendNewMessage(req);
    if (res) {
      setTotalPromptTokens(res.totalChatPromptTokens);
      setTotalCompletionTokens(res.totalChatCompletionTokens);
      setMessages((prevMessages) => {
        prevMessages[prevMessages.length - 1].promptTokens = res.promptTokens;
        return [
          ...prevMessages,
          {
            role: "Assistant",
            content: res.content,
            completionTokens: res.completionTokens,
          },
        ];
      });

      if (res.chatId && res.chatTitle) {
        isSendingFirstMessage.current = true;
        navigate(`/chat/${res.chatId}`, { replace: true });
        addChat({
          id: res.chatId,
          title: res.chatTitle,
          fav: false,
        });
      }
    }
  };

  const onEnter = async (newUserMessage: string, file: File | undefined) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        role: "User",
        content: newUserMessage,
        file: file,
      },
    ]);
    await sendMessage(newUserMessage, file);
  };

  return (
    <>
      <div className="flex flex-col h-full max-w-full md:max-w-11/12 xl:max-w-9/12 mx-auto lg:px-2">
        {messages.length === 0 && (
          <section className="grow flex items-center justify-center">
            <NewConversation
              model={model}
              setModel={setModel}
              promptId={promptId}
              setPromptId={setPromptId}
              setIsWelcomeLoaded={setIsWelcomeLoaded}
            />
          </section>
        )}
        {/* Add empty to keep view constancy while welcome is not loaded */}
        {messages.length === 0 && !isWelcomeLoaded && (
          <div className="grow"></div>
        )}
        {messages.length > 0 && (
          <section className="messages-container overflow-y-auto hide-scrollbar grow mt-0.5 px-1 md:px-5">
            <div className="min-h-full flex flex-col justify-end">
              <Messages
                messages={messages}
                isUpdatingMessagesFromScroll={false}
                isSending={isSending}
              />
            </div>
          </section>
        )}
        <InputSection onEnter={onEnter} isSending={isSending} />
      </div>
    </>
  );
};
