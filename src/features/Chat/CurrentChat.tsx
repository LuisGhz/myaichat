import { useChats } from "hooks/features/Chat/useChats";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Message } from "types/chat/Message.type";
import { Messages } from "./components/Messages/Messages";
import { InputSection } from "./components/InputSection/InputSection";
import { NewMessageReq } from "types/chat/NewMessageReq.type";
import { ChatMessagesRes } from "types/chat/ChatMessagesRes.type";
import {
  useCurrentChatStoreGetDefaultMaxOutputTokens,
  useCurrentChatStoreGetIsWebSearchMode,
  useCurrentChatStoreGetMaxOutputTokens,
  useCurrentChatStoreSetCurrentModelData,
  useCurrentChatStoreSetIsWebSearchMode,
  useCurrentChatStoreSetMaxOutputTokens,
} from "store/features/chat/useCurrentChatStore";
import { ChatTitle } from "./components/ChatTitle";

export const CurrentChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [totalPromptTokens, setTotalPromptTokens] = useState(0);
  const [totalCompletionTokens, setTotalCompletionTokens] = useState(0);
  const [currentModel, setCurrentModel] = useState("");
  const [isFirstLoaded, setIsFirstLoaded] = useState(false);
  const [page, setPage] = useState(0);
  const [isUpdatingMessagesFromScroll, setIsUpdatingMessagesFromScroll] =
    useState(false);
  const setCurrentModelData = useCurrentChatStoreSetCurrentModelData();
  const setMaxOutputTokens = useCurrentChatStoreSetMaxOutputTokens();
  const defaultMaxOutputTokens = useCurrentChatStoreGetDefaultMaxOutputTokens();
  const maxOutputTokens = useCurrentChatStoreGetMaxOutputTokens();
  const isWebSearchMode = useCurrentChatStoreGetIsWebSearchMode();
  const setIsWebSearchMode = useCurrentChatStoreSetIsWebSearchMode();
  const params = useParams();
  const navigate = useNavigate();
  const {
    getChatMessages,
    sendNewMessage,
    isSending,
    isEmptyPage,
    isChatLoading,
  } = useChats();

  useEffect(() => {
    (async () => {
      if (!params.id) {
        // Redirect to new chat page if no ID
        navigate("/chat");
        return;
      }

      const res = await getChatMessages(params.id);
      if (!res) {
        navigate("/chat");
        return;
      }
      handleFirstPageLoad(res);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  useEffect(() => {
    (async () => {
      if (page === 0) return;
      const res = await getChatMessages(params.id!, page);
      if (!res) {
        navigate("/chat");
        return;
      }
      handleNewPageLoad(res);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    if (currentModel) {
      setCurrentModelData({
        model: currentModel,
        totalPromptTokens,
        totalCompletionTokens,
      });
    }
  }, [
    currentModel,
    totalPromptTokens,
    totalCompletionTokens,
    setCurrentModelData,
  ]);

  const handleNewPageLoad = (res: ChatMessagesRes) => {
    setIsUpdatingMessagesFromScroll(() => true);
    setMessages((prevMessages) => [
      ...(res?.historyMessages || []),
      ...prevMessages,
    ]);
    setTimeout(() => {
      setIsUpdatingMessagesFromScroll(() => false);
    }, 100);
  };

  const handleFirstPageLoad = (res: ChatMessagesRes) => {
    setMessages(res?.historyMessages || []);
    setCurrentModel(res?.model || "");
    setTotalPromptTokens(res?.totalPromptTokens || 0);
    setTotalCompletionTokens(res?.totalCompletionTokens || 0);
    setMaxOutputTokens(res?.maxOutputTokens || defaultMaxOutputTokens);
    setIsWebSearchMode(res?.isWebSearchMode || false);
    setTimeout(() => {
      setIsFirstLoaded(() => true);
    }, 250);
  };

  const sendMessage = async (newUserMessage: string, file?: File) => {
    if (!params.id) return; // Should always have an ID for existing chats

    const req: NewMessageReq = {
      chatId: params.id,
      prompt: newUserMessage,
      file,
      promptId: "", // Not needed for existing chats
      maxOutputTokens,
      isWebSearchMode,
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

  const incrementPageOnScrollTop = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.scrollTop === 0 && !isEmptyPage && isFirstLoaded) {
      console.log("incrementPageOnScrollTop");
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <>
      <div className="flex flex-col h-full max-w-full md:max-w-11/12 xl:max-w-9/12 mx-auto lg:px-2">
        <ChatTitle />
        {isChatLoading && page === 0 && messages.length === 0 && (
          <section className="messages-container flex justify-center items-center overflow-y-auto hide-scrollbar grow mt-0.5 px-1 md:px-5" />
        )}
        {messages.length > 0 && (
          <section
            className="messages-container overflow-y-auto hide-scrollbar grow mt-0.5 px-1 md:px-5"
            onScroll={incrementPageOnScrollTop}
          >
            <div className="min-h-full flex flex-col justify-end">
              <Messages
                messages={messages}
                isUpdatingMessagesFromScroll={isUpdatingMessagesFromScroll}
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
