import { useChats } from "hooks/useChats";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { Message } from "types/chat/Message.type";
import { Messages } from "./components/Messages/Messages";
import { InputSection } from "./components/InputSection/InputSection";
import { NewMessageReq } from "types/chat/NewMessageReq.type";
import { NewConversation } from "./components/NewConversation";
import { ModelsValues } from "types/chat/ModelsValues.type";
import { ChatMessagesRes } from "types/chat/ChatMessagesRes.type";
import { ChatsLoading } from "./components/ChatsLoading";
import { useAppAddChatStore } from "store/useAppStore";
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
  const addChat = useAppAddChatStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [model, setModel] = useState<ModelsValues>("gemini-2.0-flash");
  const [totalPromptTokens, setTotalPromptTokens] = useState(0);
  const [totalCompletionTokens, setTotalCompletionTokens] = useState(0);
  const [promptId, setPromptId] = useState<string>("");
  const [currentModel, setCurrentModel] = useState("");
  const [isFirstLoaded, setIsFirstLoaded] = useState(false);
  const [page, setPage] = useState(0);
  const [isWelcomeLoaded, setIsWelcomeLoaded] = useState(false);
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
  const isSendingFirstMessage = useRef(false);

  useEffect(() => {
    (async () => {
      if (!params.id || isSendingFirstMessage.current) return;

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
    const req: NewMessageReq = {
      chatId: params.id,
      prompt: newUserMessage,
      file,
      promptId,
      maxOutputTokens,
      isWebSearchMode,
    };
    req.model = params.id ? undefined : model;

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

      if (!params.id && res.chatId && res.chatTitle) {
        isSendingFirstMessage.current = true;
        navigate(`/chat/${res.chatId}`, { replace: true });
        setCurrentModel(model);
        addChat({
          id: res.chatId,
          title: res.chatTitle,
          fav: false,
        });
        // Add a small delay to ensure the state is not going to be reset on useEffect
        setTimeout(() => {
          isSendingFirstMessage.current = false;
        }, 250);
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
        {params.id && <ChatTitle />}
        {messages.length === 0 && !isChatLoading && !params.id && (
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
        {/* Add empty to keep view constancy while ChatsLoading is showing up */}
        {messages.length === 0 && !isChatLoading && !isWelcomeLoaded && (
          <div className="grow"></div>
        )}
        {isChatLoading && page === 0 && messages.length === 0 && (
          <ChatsLoading />
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
