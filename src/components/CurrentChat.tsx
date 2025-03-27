import { useChats } from "hooks/useChats";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import { Message } from "types/chat/Message.type";
import { MessagesList } from "./MessagesList";
import { InputSection } from "./InputSection";

export const CurrentChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const params = useParams();
  const { getChatMessages, sendNewMessage } = useChats();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      if (params.id) setMessages(await getChatMessages(params.id));
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onSend = async (newUserMessage: string) => {
    setMessages(prevMessages => [
      ...prevMessages,
      {
        role: "User",
        content: newUserMessage
      }
    ]);
    const res = await sendNewMessage(newUserMessage);
    if (res) {
      setMessages(prevMessages => [
        ...prevMessages,
        {
          role: "Assistant",
          content: res.content
        }
      ]);
    }
  };

  return (
    <>
      <div className="flex flex-col h-full max-w-9/12 mx-auto pt-2">
        {messages.length === 0 && <section className="grow">History</section>}
        {messages.length > 0 && (
          <section className="grow overflow-y-auto hide-scrollbar">
            <MessagesList messages={messages} />
            <div ref={messagesEndRef} />
          </section>
        )}
        <InputSection onSend={onSend} />
      </div>
    </>
  );
};
