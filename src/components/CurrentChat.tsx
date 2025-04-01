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

export const CurrentChat = () => {
  const { getAllChatsForList } = useContext(AppContext);
  const [messages, setMessages] = useState<Message[]>([]);
  const [model, setModel] = useState<Models>("gpt-4o-mini");
  const [currentModel, setCurrentModel] = useState("");
  const params = useParams();
  const navigate = useNavigate();
  const { getChatMessages, sendNewMessage } = useChats();

  useEffect(() => {
    (async () => {
      if (params.id) {
        const res = await getChatMessages(params.id);
        setMessages(res?.historyMessages || []);
        setCurrentModel(res?.model || "");
        return;
      }
      setCurrentModel("");
      setModel("gpt-4o-mini");
      setMessages([]);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const sendMessage = async (newUserMessage: string) => {
    const req: NewMessageReq = {
      chatId: params.id,
      prompt: newUserMessage,
    };
    req.model = params.id ? undefined : model;

    const res = await sendNewMessage(req);
    if (res) {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "Assistant",
          content: res.content,
        },
      ]);

      if (!params.id && res.chatId) {
        navigate(`/chat/${res.chatId}`, { replace: true });
        setCurrentModel(model);
        getAllChatsForList();
      }
    }
  };

  const onEnter = async (newUserMessage: string) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        role: "User",
        content: newUserMessage,
      },
    ]);
    await sendMessage(newUserMessage);
  };

  return (
    <>
      <div className="flex flex-col h-full max-w-full md:max-w-9/12 mx-auto pt-5 md:pt-2">
        {currentModel && (
          <div className="text-gray-700 text-xs">{currentModel}</div>
        )}
        {messages.length === 0 && (
          <section className="grow">
            <NewConversation model={model} setModel={setModel} />
          </section>
        )}
        {messages.length > 0 && (
          <section className="grow overflow-y-auto hide-scrollbar px-1 md:px-5">
            <MessagesList messages={messages} />
          </section>
        )}
        <InputSection onEnter={onEnter} />
      </div>
    </>
  );
};
