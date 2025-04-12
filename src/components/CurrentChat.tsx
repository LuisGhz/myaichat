import { useChats } from "hooks/useChats";
import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router";
import { Message } from "types/chat/Message.type";
import { MessagesList } from "./MessagesList";
import { InputSection } from "./InputSection/InputSection";
import { NewMessageReq } from "types/chat/NewMessageReq.type";
import { AppContext } from "context/AppContext";
import { NewConversation } from "./NewConversation";
import { Models } from "types/chat/Models.type";
import { CurrentModelSummary } from "./CurrentModelSummary";

export const CurrentChat = () => {
  const { getAllChatsForList } = useContext(AppContext);
  const [messages, setMessages] = useState<Message[]>([]);
  const [model, setModel] = useState<Models>("gpt-4o-mini");
  const [currentModel, setCurrentModel] = useState("");
  const params = useParams();
  const navigate = useNavigate();
  const { getChatMessages, sendNewMessage, isSending } = useChats();

  useEffect(() => {
    (async () => {
      if (params.id) {
        const res = await getChatMessages(params.id);
        if (!res) {
          navigate("/chat");
          resetState();
          return;
        }
        setMessages(res?.historyMessages || []);
        setCurrentModel(res?.model || "");
        return;
      }
      resetState();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const resetState = () => {
    setMessages([]);
    setModel("gpt-4o-mini");
    setCurrentModel("");
  };

  const sendMessage = async (newUserMessage: string, image?: File) => {
    const req: NewMessageReq = {
      chatId: params.id,
      prompt: newUserMessage,
      image,
    };
    req.model = params.id ? undefined : model;

    const res = await sendNewMessage(req);
    if (res) {
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

  return (
    <>
      <div className="flex flex-col h-full max-w-full md:max-w-11/12 mx-auto pt-6.5 md:pt-2 lg:px-2">
        {currentModel && (
          <CurrentModelSummary
            currentModel={currentModel}
            messages={messages}
          />
        )}
        {messages.length === 0 && (
          <section className="grow">
            <NewConversation model={model} setModel={setModel} />
          </section>
        )}
        {messages.length > 0 && (
          <section className="grow overflow-y-auto hide-scrollbar mt-0.5 px-1 md:px-5">
            <MessagesList messages={messages} />
          </section>
        )}
        <InputSection onEnter={onEnter} isSending={isSending} />
      </div>
    </>
  );
};
