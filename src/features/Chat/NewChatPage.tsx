import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Spin } from "antd";
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

export const NewChatPage = () => {
  const addChat = useAppAddChatStore();
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState<ModelsValues>("gemini-2.0-flash");
  const [totalPromptTokens, setTotalPromptTokens] = useState(0);
  const [totalCompletionTokens, setTotalCompletionTokens] = useState(0);
  const [promptId, setPromptId] = useState<string>("");
  const setCurrentModelData = useCurrentChatStoreSetCurrentModelData();
  const setMaxOutputTokens = useCurrentChatStoreSetMaxOutputTokens();
  const defaultMaxOutputTokens = useCurrentChatStoreGetDefaultMaxOutputTokens();
  const maxOutputTokens = useCurrentChatStoreGetMaxOutputTokens();
  const isWebSearchMode = useCurrentChatStoreGetIsWebSearchMode();
  const setIsWebSearchMode = useCurrentChatStoreSetIsWebSearchMode();
  const navigate = useNavigate();
  const { sendNewMessage, isSending } = useChats();

  useEffect(() => {
    // Reset state for new chat
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
      if (res.chatId && res.chatTitle) {
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
    setIsLoading(true);
    await sendMessage(newUserMessage, file);
    setIsLoading(false);
  };

  return (
    <>
      <div className="flex flex-col h-full max-w-full md:max-w-11/12 xl:max-w-9/12 mx-auto lg:px-2">
        {!isLoading && (
          <section className="grow flex items-center justify-center">
            <NewConversation
              model={model}
              setModel={setModel}
              promptId={promptId}
              setPromptId={setPromptId}
            />
          </section>
        )}
        {isLoading && (
          <section className="messages-container flex justify-center items-center overflow-y-auto hide-scrollbar grow mt-0.5 px-1 md:px-5">
            <Spin size="large" />
          </section>
        )}
        <InputSection onEnter={onEnter} isSending={isSending} />
      </div>
    </>
  );
};
