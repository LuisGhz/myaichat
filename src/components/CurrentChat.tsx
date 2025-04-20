import { useChats } from "hooks/useChats";
import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router";
import { Message } from "types/chat/Message.type";
import { Messages } from "./Messages/Messages";
import { InputSection } from "./InputSection/InputSection";
import { NewMessageReq } from "types/chat/NewMessageReq.type";
import { AppContext } from "context/AppContext";
import { NewConversation } from "./NewConversation";
import { Models } from "types/chat/Models.type";
import { CurrentModelSummary } from "./CurrentModelSummary";
import { ChatMessagesRes } from "types/chat/ChatMessagesRes.type";

export const CurrentChat = () => {
  const { getAllChatsForList } = useContext(AppContext);
  const [messages, setMessages] = useState<Message[]>([]);
  const [model, setModel] = useState<Models>("gpt-4o-mini");
  const [totalPromptTokens, setTotalPromptTokens] = useState(0);
  const [totalCompletionTokens, setTotalCompletionTokens] = useState(0);
  const [promptId, setPromptId] = useState<string>("");
  const [currentModel, setCurrentModel] = useState("");
  const [page, setPage] = useState(0);
  const [isUpdatingMessagesFromScroll, setIsUpdatingMessagesFromScroll] =
    useState(false);
  const params = useParams();
  const navigate = useNavigate();
  const {
    getChatMessages,
    sendNewMessage,
    isSending,
    isEmptyPage,
    setIsEmptyPage,
  } = useChats();

  useEffect(() => {
    (async () => {
      resetState();
      if (!params.id) return;

      const res = await getChatMessages(params.id);
      if (!res) {
        navigate("/chat");
        resetState();
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
        resetState();
        return;
      }
      handleNewPageLoad(res);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

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
  };

  const resetState = () => {
    setMessages([]);
    setModel("gpt-4o-mini");
    setPromptId("");
    setCurrentModel("");
    setPage(() => 0);
    setIsEmptyPage(() => false);
    setTotalPromptTokens(() => 0);
    setTotalCompletionTokens(() => 0);
  };

  const sendMessage = async (newUserMessage: string, image?: File) => {
    const req: NewMessageReq = {
      chatId: params.id,
      prompt: newUserMessage,
      image,
      promptId,
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

      if (!params.id && res.chatId) {
        navigate(`/chat/${res.chatId}`, { replace: true });
        setCurrentModel(model);
        getAllChatsForList();
      }
    }
  };

  const onEnter = async (newUserMessage: string, image: File | undefined) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        role: "User",
        content: newUserMessage,
        image: image,
      },
    ]);
    await sendMessage(newUserMessage, image);
  };

  const incrementPageOnScrollTop = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    if (target.scrollTop < 5 && !isEmptyPage)
      setPage((prevPage) => prevPage + 1);
  };

  return (
    <>
      <div className="flex flex-col h-full max-w-full md:max-w-11/12 mx-auto pt-6.5 md:pt-2 lg:px-2">
        {currentModel && (
          <CurrentModelSummary
            currentModel={currentModel}
            totalCompletionTokens={totalCompletionTokens}
            totalPromptTokens={totalPromptTokens}
          />
        )}
        {messages.length === 0 && (
          <section className="grow">
            <NewConversation
              model={model}
              setModel={setModel}
              promptId={promptId}
              setPromptId={setPromptId}
            />
          </section>
        )}
        {messages.length > 0 && (
          <section
            className="grow overflow-y-auto hide-scrollbar mt-0.5 px-1 md:px-5"
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
